"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"
import { confirm } from "@/components/ui/confirm"
import {
  deleteMoment,
  markMomentSeen,
  reactToMoment,
  replyToMoment,
  unreactToMoment,
} from "../api"
import type { Moment } from "../types"
import { MOMENT_DURATION_MS } from "../utils/constants"
import { isReady, upcomingImage } from "../utils/playback"
import { authorMomentsKey, MOMENTS_TRAY_KEY } from "../utils/keys"
import { useAuthorMoments } from "./use-author-moments"
import { useMomentClock } from "./use-moment-clock"
import { showErrorMessage, showSuccess } from "@/lib/feedback"

export function useMomentPlayer(
  authorId: string,
  {
    onFinished,
    onRewound,
    enterAtEnd = false,
  }: {
    onFinished: () => void
    onRewound: () => void
    enterAtEnd?: boolean
  }
) {
  const {
    data: moments,
    isLoading,
    isError,
    refetch,
  } = useAuthorMoments(authorId)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [held, setHeld] = useState(false)
  const [backgrounded, setBackgrounded] = useState(false)
  const [viewersOpen, setViewersOpen] = useState(false)
  const queryClient = useQueryClient()

  const list = moments ?? []
  const current = list[index] ?? null
  const seen = useRef(new Set<string>())
  const watched = useRef(new Set<string>())

  const { mutate: remove, isPending: removing } = useMutation({
    mutationFn: deleteMoment,
    onSuccess: async () => {
      const wasTheirLast = list.length <= 1

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: MOMENTS_TRAY_KEY }),
        queryClient.invalidateQueries({ queryKey: authorMomentsKey(authorId) }),
      ])

      setPaused(false)
      if (wasTheirLast) onFinished()
    },
    onError: () => {
      setPaused(false)
      showErrorMessage("Could not take that down. Try again.")
    },
  })

  const { mutate: markSeen } = useMutation({ mutationFn: markMomentSeen })

  useEffect(
    () => () => {
      if (watched.current.size === 0) return

      void queryClient.invalidateQueries({ queryKey: MOMENTS_TRAY_KEY })
      for (const id of watched.current) {
        void queryClient.invalidateQueries({ queryKey: authorMomentsKey(id) })
      }
    },
    [queryClient]
  )

  // Where a run opens is decided by whose run it is, so it is settled on the render the author
  // changes on rather than a pass later, which would flash the wrong card first.
  const [positionedFor, setPositionedFor] = useState<string | null>(null)
  if (list.length > 0 && positionedFor !== authorId) {
    setPositionedFor(authorId)

    if (enterAtEnd) setIndex(list.length - 1)
    else {
      const first = list.findIndex((moment) => !moment.seen)
      setIndex(first === -1 ? 0 : first)
    }
  }

  if (list.length > 0 && index >= list.length) setIndex(list.length - 1)

  useEffect(() => {
    if (!current || current.mine || seen.current.has(current.id)) return

    seen.current.add(current.id)
    watched.current.add(authorId)
    markSeen(current.id)
  }, [current, markSeen, authorId])

  const next = useCallback(() => {
    if (index + 1 < list.length) {
      setIndex(index + 1)
      return
    }

    onFinished()
  }, [index, list.length, onFinished])

  const previous = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1)
      return
    }

    onRewound()
  }, [index, onRewound])

  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set())
  const markReady = useCallback(
    (id: string) =>
      setLoaded((prev) => (prev.has(id) ? prev : new Set(prev).add(id))),
    []
  )
  const ready = current !== null && isReady(current, loaded)

  const upcoming = upcomingImage(list, index)
  useEffect(() => {
    if (!upcoming) return
    const image = new Image()
    image.src = upcoming
  }, [upcoming])

  const clock = useMomentClock({
    duration: MOMENT_DURATION_MS,
    running: ready && !paused && !held && !backgrounded && !viewersOpen,
    restartKey: current?.id ?? null,
    onDone: next,
  })

  const patchReaction = useCallback(
    (momentId: string, emoji: string | null) => {
      queryClient.setQueryData<Moment[]>(authorMomentsKey(authorId), (rows) =>
        rows?.map((moment) =>
          moment.id === momentId ? { ...moment, my_reaction: emoji } : moment
        )
      )
    },
    [queryClient, authorId]
  )

  const { mutate: react } = useMutation({
    mutationFn: ({
      momentId,
      emoji,
    }: {
      momentId: string
      emoji: string | null
    }) =>
      emoji === null
        ? unreactToMoment(momentId)
        : reactToMoment(momentId, emoji),
    onMutate: ({ momentId, emoji }) => {
      const before =
        list.find((moment) => moment.id === momentId)?.my_reaction ?? null
      patchReaction(momentId, emoji)
      return { before }
    },
    onError: (_error, { momentId }, context) => {
      patchReaction(momentId, context?.before ?? null)
      showErrorMessage("Could not send that. Try again.")
    },
  })

  const toggleReaction = useCallback(
    (emoji: string) => {
      if (!current || current.mine) return

      react({
        momentId: current.id,
        emoji: current.my_reaction === emoji ? null : emoji,
      })
    },
    [current, react]
  )

  const { mutate: sendReply, isPending: replying } = useMutation({
    mutationFn: ({ momentId, body }: { momentId: string; body: string }) =>
      replyToMoment(momentId, body),
    onSuccess: () => {
      showSuccess("Sent to their DMs.")
      setPaused(false)
    },
    onError: () => showErrorMessage("Could not send that. Try again."),
  })

  const reply = useCallback(
    (body: string) => {
      const text = body.trim()
      if (!current || current.mine || !text || replying) return

      sendReply({ momentId: current.id, body: text })
    },
    [current, replying, sendReply]
  )

  const deleteCurrent = useCallback(() => {
    if (!current || removing) return
    const id = current.id

    setPaused(true)
    confirm({
      title: "Delete this moment?",
      message: "It goes for everyone, and cannot be undone.",
      onCancel: () => setPaused(false),
      actions: [
        { label: "Delete", destructive: true, onPress: () => remove(id) },
      ],
    })
  }, [current, removing, remove])

  return {
    moments: list,
    current,
    index,
    paused,
    held,
    clock,
    ready,
    markReady,
    loading: isLoading,
    failed: isError,
    retry: () => void refetch(),
    removing,
    replying,
    viewers: {
      open: viewersOpen,
      onOpenChange: setViewersOpen,
    },
    openViewers: useCallback(() => setViewersOpen(true), []),
    deleteCurrent,
    hold: useCallback(() => setHeld(true), []),
    release: useCallback(() => setHeld(false), []),
    setBackgrounded,
    pause: useCallback(() => setPaused(true), []),
    resume: useCallback(() => setPaused(false), []),
    tapForward: next,
    tapBack: previous,
    toggleReaction,
    reply,
  }
}
