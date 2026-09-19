"use client"

import { useEffect, useMemo, useState } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useReactionBursts } from "@/hooks/use-reaction-bursts"
import { driveVideo, FAST_RATE } from "../../playback"
import type { ClipPageHandlers, ClipPlayback } from "../../types"
import { clipFit, type PlayableClip } from "../../utils/viewer"
import { useStreamedVideo } from "../use-streamed-video"
import { useClipGestures } from "./use-clip-gestures"

const SLOW_MS = 400

export function useClipPage(
  snacc: PlayableClip | null,
  handlers: ClipPageHandlers,
  playback: ClipPlayback
) {
  const { active, playing, paused, fast, muted, veiled } = playback
  const id = snacc?.id ?? null
  const url = snacc && !veiled ? snacc.clip.hls_url : null
  const [framedFor, setFramedFor] = useState<string | null>(null)
  const [failedFor, setFailedFor] = useState<string | null>(null)
  const [stalled, setStalled] = useState(false)
  const [rolling, setRolling] = useState(false)
  const stream = useStreamedVideo(url, {
    eager: true,
    onFail: () => setFailedFor(id),
  })
  const video = stream.ref
  const bursts = useReactionBursts(id ?? "")

  const framed = id !== null && framedFor === id
  const failed = id !== null && failedFor === id
  const showing = active && !veiled && !failed
  const loading = showing && (!framed || stalled)
  const slow = useDebouncedValue(loading, SLOW_MS)

  const wanted = useMemo(
    () => ({
      play: active && playing && url !== null,
      muted,
      rate: fast ? FAST_RATE : 1,
    }),
    [active, playing, url, muted, fast]
  )

  useEffect(() => {
    const element = video.current
    if (!element) return
    return handlers.attach(element)
  }, [handlers, video])

  useEffect(() => {
    const element = video.current
    if (element) driveVideo(element, wanted, handlers.onSoundBlocked)
  }, [video, wanted, handlers])

  useEffect(() => {
    if (active) handlers.onPlaying(rolling)
  }, [active, rolling, handlers])

  const gestures = useClipGestures({
    onTap: () => {
      if (!snacc) return
      if (veiled) handlers.onReveal(snacc)
      else handlers.onTogglePause()
    },
    onDoubleTap: (x, y) => {
      if (snacc && !veiled) bursts.add(handlers.onQuickReact(snacc), x, y)
    },
    onHold: (held) => {
      if (!veiled || !held) handlers.onHold(held)
    },
  })

  return {
    framed,
    veiled,
    gestures,
    fit: snacc ? clipFit(snacc.clip) : ("cover" as const),
    fast: active && fast,
    failed: active && failed,
    label: `Clip by ${snacc?.anonymous ? "Ghost" : (snacc?.author.username ?? "someone")}`,
    center: loading
      ? slow
        ? ("loading" as const)
        : null
      : showing && paused
        ? ("paused" as const)
        : null,
    bursts: bursts.bursts,
    clearBurst: bursts.remove,
    onRetry: () => {
      setFailedFor(null)
      stream.reload()
    },
    scrub: {
      video,
      enabled: active && framed,
      durationMs: snacc?.clip.duration_ms ?? 0,
    },
    video: {
      ref: video,
      onLoadedData: () => setFramedFor(id),
      onCanPlay: () => {
        setStalled(false)
        const element = video.current
        if (element) driveVideo(element, wanted, handlers.onSoundBlocked)
      },
      onPlaying: () => {
        setStalled(false)
        setRolling(true)
      },
      onPause: () => setRolling(false),
      onWaiting: () => {
        setStalled(true)
        setRolling(false)
      },
      onEmptied: () => {
        setStalled(false)
        setRolling(false)
      },
      onError: () => {
        if (url) setFailedFor(id)
      },
    },
    rail: snacc
      ? {
          snacc,
          onReact: (emoji: string) => handlers.onReact(snacc, emoji),
          onComment: () => handlers.onComment(snacc),
          onResnacc: () => handlers.onResnacc(snacc),
          onShare: () => handlers.onShare(snacc),
          onMore: () => handlers.onMore(snacc),
        }
      : null,
  }
}
