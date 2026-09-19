"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { signal } from "@/features/signals/utils/queue"
import { useSnacc } from "@/features/snaccs/hooks/use-snacc"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useRecordView } from "@/features/views/hooks/use-record-view"
import {
  currentVoicePlayback,
  useVoicePlayback,
  voicePlayer,
} from "@/features/voice/hooks/use-voice-player"
import { useBack } from "@/hooks/use-back"
import { usePageVisible } from "@/hooks/use-page-visible"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { forgetPlace, placeIn, rememberPlace } from "../../place"
import type { ClipPageHandlers, ClipPlayback } from "../../types"
import {
  livePages,
  ownsKey,
  pageAt,
  upcomingPosters,
  viewerKey,
  viewerQueue,
  wantsMore,
  type PlayableClip,
} from "../../utils/viewer"
import { useClipStream } from "./use-clip-stream"
import { useClipWatch } from "./use-clip-watch"

const QUICK_REACTION = "❤️"

export function useClipViewer(startId: string, startRevealed: boolean) {
  const back = useBack()
  const queryClient = useQueryClient()
  const clipsOn = useFlagWhenKnown("snacc_clips")
  const [firstId] = useState(() => placeIn(startId) ?? startId)
  const start = useSnacc(firstId)
  const stream = useClipStream(clipsOn === true)
  const queue = useMemo(
    () => viewerQueue(start.data, stream.items),
    [start.data, stream.items]
  )
  const { handlers: actions, sheets } = useSnaccActions()
  const pageVisible = usePageVisible()
  const reducedMotion = useReducedMotion()
  const voicePlaying = useVoicePlayback()?.status === "playing"

  const scroller = useRef<HTMLDivElement>(null)
  const videos = useRef(new Set<HTMLVideoElement>())
  const [pageHeight, setPageHeight] = useState(0)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [fast, setFast] = useState(false)
  const [muted, setMuted] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(
    () => new Set(startRevealed ? [startId] : [])
  )

  const settled = clipsOn !== null && !stream.loading
  const ended = queue.length > 0 && settled && !stream.hasMore
  const ending = stream.failed
    ? ("failed" as const)
    : ended
      ? ("caught-up" as const)
      : null
  const pageCount = queue.length + (ending ? 1 : 0)
  const index = Math.min(active, Math.max(pageCount - 1, 0))
  const current = queue[index] ?? null
  const currentId = current?.id ?? null
  const silent = muted || blocked

  const isVeiled = (snacc: PlayableClip) =>
    snacc.spoiler && !revealed.has(snacc.id)
  const veiled = current !== null && isVeiled(current)

  useRecordView(firstId)
  useClipWatch(currentId, pageVisible && !veiled, playing)

  useEffect(() => {
    voicePlayer.pause()
    return () => {
      queryClient.removeQueries({ queryKey: snaccKeys.clipLists() })
    }
  }, [queryClient])

  useEffect(() => {
    if (currentId) rememberPlace(startId, currentId)
  }, [startId, currentId])

  const loadMore = useEffectEvent(() => {
    if (stream.hasMore && !stream.loadingMore) stream.loadMore()
  })
  useEffect(() => {
    if (wantsMore(index, queue.length)) loadMore()
  }, [index, queue.length])

  const posters = upcomingPosters(queue, index).join("|")
  useEffect(() => {
    if (!posters) return
    for (const url of posters.split("|")) new Image().src = url
  }, [posters])

  const realign = useEffectEvent(() => {
    scroller.current?.scrollTo({ top: index * pageHeight })
  })
  useLayoutEffect(() => {
    realign()
  }, [pageHeight])

  const measure = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(() => setPageHeight(node.clientHeight))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function step(by: number) {
    const next = Math.min(pageCount - 1, Math.max(0, index + by))
    scroller.current?.scrollTo({
      top: next * pageHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    })
  }

  function toggleMute() {
    const next = blocked ? false : !muted
    videos.current.forEach((video) => {
      video.muted = next
    })
    setBlocked(false)
    setMuted(next)
  }

  function close() {
    forgetPlace()
    back()
  }

  const handlers = useMemo<ClipPageHandlers>(
    () => ({
      attach: (video) => {
        videos.current.add(video)
        return () => {
          videos.current.delete(video)
        }
      },
      onPlaying: setPlaying,
      onSoundBlocked: () => setBlocked(true),
      onTogglePause: () => {
        if (currentVoicePlayback()?.status === "playing") {
          voicePlayer.pause()
          setPaused(false)
          return
        }
        setPaused((value) => !value)
      },
      onHold: setFast,
      onQuickReact: (snacc) => {
        if (snacc.my_reaction) return snacc.my_reaction
        actions.onReact(snacc, QUICK_REACTION)
        return QUICK_REACTION
      },
      onReveal: (snacc) => {
        signal("spoiler_reveal", { subjectId: snacc.id })
        setRevealed((shown) => new Set(shown).add(snacc.id))
      },
      onReact: actions.onReact,
      onComment: actions.onComment,
      onResnacc: actions.onResnacc,
      onShare: actions.onShare,
      onMore: actions.onOpenActions,
    }),
    [actions]
  )

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey) return
    const key = viewerKey(event.key)
    if (!key || ownsKey(event.target, key)) return

    event.preventDefault()
    if (key === "next") step(1)
    else if (key === "previous") step(-1)
    else if (key === "pause") handlers.onTogglePause()
    else if (key === "mute") toggleMute()
    else close()
  })
  useEffect(() => {
    const listen = (event: KeyboardEvent) => onKey(event)
    window.addEventListener("keydown", listen)
    return () => window.removeEventListener("keydown", listen)
  }, [])

  const playbackFor = (page: number, snacc: PlayableClip): ClipPlayback => ({
    active: page === index,
    playing: pageVisible && !paused && !voicePlaying,
    paused,
    fast,
    muted: silent,
    veiled: isVeiled(snacc),
  })

  return {
    queue,
    live: livePages(index, queue.length),
    handlers,
    sheets,
    pageHeight,
    measure,
    scroller,
    playbackFor,
    isVeiled,
    state:
      start.isLoading || (queue.length === 0 && !settled)
        ? ("loading" as const)
        : queue.length > 0
          ? ("ready" as const)
          : stream.failed
            ? ("failed" as const)
            : ("empty" as const),
    ending,
    retryStream: stream.retry,
    onScroll: () => {
      const node = scroller.current
      if (!node) return
      const next = pageAt(node.scrollTop, pageHeight, pageCount)
      if (next === active) return

      voicePlayer.pause()
      setActive(next)
      setPaused(false)
      setFast(false)
      setPlaying(false)
    },
    muted: silent,
    soundBlocked: blocked,
    toggleMute,
    canStep: { previous: index > 0, next: index < pageCount - 1 },
    step,
    close,
  }
}
