"use client"

import { useEffect, useRef } from "react"
import { showErrorMessage } from "@/lib/feedback"
import type { VoiceNote, VoicePlaybackStatus } from "../types"
import { mediaDurationMs, playedFraction } from "../utils/playback"
import { currentPlaybackSpeed, usePlaybackSpeed } from "./use-playback-speed"
import {
  bindVoiceDriver,
  currentVoicePlayback,
  reportPlayback,
  useVoicePlayback,
  voicePlayer,
} from "./use-voice-player"

const SESSION_STATE: Record<VoicePlaybackStatus, MediaSessionPlaybackState> = {
  loading: "playing",
  playing: "playing",
  paused: "paused",
}

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError"
}

function setSessionHandlers(session: MediaSession, on: boolean): void {
  const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
    [
      "play",
      () => {
        if (currentVoicePlayback()?.status === "paused") voicePlayer.toggle()
      },
    ],
    ["pause", voicePlayer.pause],
    ["stop", voicePlayer.stop],
    [
      "seekto",
      (details) => {
        const now = currentVoicePlayback()
        if (!now || details.seekTime === undefined) return
        voicePlayer.seek(
          playedFraction(details.seekTime * 1000, now.durationMs)
        )
      },
    ],
  ]
  for (const [action, handler] of handlers) {
    try {
      session.setActionHandler(action, on ? handler : null)
    } catch {}
  }
}

export function useVoiceNoteHost(): void {
  const audio = useRef<HTMLAudioElement | null>(null)
  const speed = usePlaybackSpeed()
  const playback = useVoicePlayback()
  const note = playback?.note ?? null
  const source = playback?.source ?? null
  const status = playback?.status ?? null

  useEffect(() => {
    const element = new Audio()
    element.preload = "auto"
    audio.current = element
    let loaded: VoiceNote | null = null
    let failed = false

    const report = (change: Parameters<typeof reportPlayback>[1]) => {
      if (loaded) reportPlayback(loaded.id, change)
    }
    const fail = (error?: unknown) => {
      if (!loaded || failed || isAbort(error)) return
      failed = true
      showErrorMessage("Could not play this voice note.")
      voicePlayer.stop()
    }

    const onMetadata = () => {
      if (!loaded) return
      report({
        durationMs: mediaDurationMs(element.duration, loaded.duration_ms),
      })
    }
    const onPlaying = () => report({ status: "playing" })
    const onPause = () => {
      if (!element.ended) report({ status: "paused" })
    }
    const onTime = () => report({ positionMs: element.currentTime * 1000 })
    const onEnded = () => voicePlayer.stop()
    const onError = () => fail()

    element.addEventListener("loadedmetadata", onMetadata)
    element.addEventListener("playing", onPlaying)
    element.addEventListener("pause", onPause)
    element.addEventListener("timeupdate", onTime)
    element.addEventListener("ended", onEnded)
    element.addEventListener("error", onError)

    const unbind = bindVoiceDriver({
      load(next) {
        loaded = next
        failed = false
        element.src = next.url
        element.defaultPlaybackRate = currentPlaybackSpeed()
        element.playbackRate = element.defaultPlaybackRate
        element.play().catch(fail)
      },
      resume() {
        element.play().catch(fail)
      },
      pause() {
        element.pause()
      },
      seek(ms) {
        element.currentTime = ms / 1000
      },
      unload() {
        loaded = null
        element.pause()
        element.removeAttribute("src")
        element.load()
      },
    })

    return () => {
      unbind()
      loaded = null
      element.removeEventListener("loadedmetadata", onMetadata)
      element.removeEventListener("playing", onPlaying)
      element.removeEventListener("pause", onPause)
      element.removeEventListener("timeupdate", onTime)
      element.removeEventListener("ended", onEnded)
      element.removeEventListener("error", onError)
      element.pause()
      element.removeAttribute("src")
      element.load()
      audio.current = null
    }
  }, [])

  useEffect(() => {
    const element = audio.current
    if (!element) return
    element.defaultPlaybackRate = speed
    element.playbackRate = speed
  }, [speed])

  useEffect(() => {
    if (!("mediaSession" in navigator)) return
    const session = navigator.mediaSession
    if (!note) {
      session.metadata = null
      setSessionHandlers(session, false)
      return
    }
    session.metadata = new MediaMetadata({
      title: "Voice note",
      artist: source?.label ?? "",
      artwork: source?.avatarUrl ? [{ src: source.avatarUrl }] : [],
    })
    setSessionHandlers(session, true)
  }, [note, source])

  useEffect(() => {
    if (!("mediaSession" in navigator)) return
    navigator.mediaSession.playbackState = status
      ? SESSION_STATE[status]
      : "none"
  }, [status])
}
