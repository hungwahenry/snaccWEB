"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { VoiceNote, VoiceSource } from "../types"
import { levelsFor } from "../utils/levels"
import { playedFraction, shownElapsed } from "../utils/playback"
import { barCount, WAVE_WIDTH } from "../utils/wave"
import { cyclePlaybackSpeed, usePlaybackSpeed } from "./use-playback-speed"
import {
  currentVoicePlayback,
  useVoicePlaybackOf,
  voicePlayer,
} from "./use-voice-player"

export function useVoiceNote(note: VoiceNote, source: VoiceSource | null) {
  const playback = useVoicePlaybackOf(note.id)
  const speed = usePlaybackSpeed()
  const [scrub, setScrub] = useState<number | null>(null)
  const [width, setWidth] = useState(WAVE_WIDTH)

  if (!playback && scrub !== null) setScrub(null)

  const measure = useCallback((node: HTMLElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.contentRect.width
      if (next > 0)
        setWidth((current) => (Math.abs(current - next) < 1 ? current : next))
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const sourced = source !== null
  useEffect(() => {
    if (sourced) return
    return () => {
      if (currentVoicePlayback()?.note.id === note.id) voicePlayer.stop()
    }
  }, [note.id, sourced])

  const totalMs = playback?.durationMs ?? note.duration_ms
  const positionMs = playback?.positionMs ?? 0
  const playing = playback !== null && playback.status !== "paused"

  return {
    engaged: playback !== null,
    playing,
    loading: playback?.status === "loading",
    totalMs,
    progress: scrub ?? playedFraction(positionMs, totalMs),
    elapsedMs: shownElapsed({ scrub, playing, elapsedMs: positionMs, totalMs }),
    speed,
    play: useCallback(() => voicePlayer.play(note, source), [note, source]),
    toggle: voicePlayer.toggle,
    cycleSpeed: cyclePlaybackSpeed,
    beginScrub: setScrub,
    moveScrub: setScrub,
    endScrub: useCallback((fraction: number) => {
      setScrub(null)
      voicePlayer.seek(fraction)
    }, []),
    cancelScrub: useCallback(() => setScrub(null), []),
    measure,
    levels: useMemo(
      () => levelsFor(note.id, barCount(width)),
      [note.id, width]
    ),
  }
}
