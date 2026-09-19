"use client"

import { useState, type RefObject } from "react"
import { clock } from "@/features/voice/utils/clock"
import { playedFraction } from "@/features/voice/utils/playback"
import { seekVideo } from "../playback"
import { usePlayhead } from "./use-playhead"

export function useClipScrubber(
  video: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
  durationMs: number
) {
  const head = usePlayhead(video, enabled)
  const [scrubbingMs, setScrubbingMs] = useState<number | null>(null)
  const shownMs = Math.min(durationMs, scrubbingMs ?? head.ms)

  const hold = (fraction: number) => setScrubbingMs(fraction * durationMs)

  return {
    elapsedMs: shownMs,
    progress: playedFraction(shownMs, durationMs),
    scrubbing: scrubbingMs !== null,
    label: `${clock(shownMs)} / ${clock(durationMs)}`,
    valueText: `${clock(shownMs)} of ${clock(durationMs)}`,
    onBegin: hold,
    onMove: hold,
    onEnd: (fraction: number) => {
      const element = video.current
      const ms = fraction * durationMs
      if (element && enabled) {
        seekVideo(element, ms)
        head.jumpTo(ms)
      }
      setScrubbingMs(null)
    },
    onCancel: () => setScrubbingMs(null),
  }
}
