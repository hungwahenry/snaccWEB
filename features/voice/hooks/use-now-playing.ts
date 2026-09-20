"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  hidesNowPlaying,
  nowPlayingTime,
  voiceSourcePath,
} from "../utils/now-playing"
import { playedFraction } from "../utils/playback"
import { cyclePlaybackSpeed, usePlaybackSpeed } from "./use-playback-speed"
import { useVoicePlayback, voicePlayer } from "./use-voice-player"

export function useNowPlaying() {
  const router = useRouter()
  const pathname = usePathname()
  const speed = usePlaybackSpeed()
  const playback = useVoicePlayback()
  const live = playback?.source ? playback : null
  const [shown, setShown] = useState(live)
  if (live && live !== shown) setShown(live)

  const source = shown?.source
  if (!shown || !source) return null

  return {
    open: live !== null && !hidesNowPlaying(pathname),
    noteId: shown.note.id,
    label: source.label,
    avatarUrl: source.avatarUrl,
    time: nowPlayingTime(shown.positionMs, shown.durationMs),
    progress: playedFraction(shown.positionMs, shown.durationMs),
    playing: shown.status === "playing",
    loading: shown.status === "loading",
    speed,
    onOpen: () => router.push(voiceSourcePath(source)),
    onToggle: voicePlayer.toggle,
    onCycleSpeed: cyclePlaybackSpeed,
    onStop: voicePlayer.stop,
  }
}
