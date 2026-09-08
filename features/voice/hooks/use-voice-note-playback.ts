"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { VoiceNote } from "../types"
import { claimPlayback, releasePlayback } from "../utils/playback"
import { cyclePlaybackSpeed, usePlaybackSpeed } from "./use-playback-speed"

type Status = {
  loading: boolean
  playing: boolean
  elapsedMs: number
  totalMs: number
}

export function useVoiceNotePlayback(note: VoiceNote, onRelease: () => void) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [status, setStatus] = useState<Status>({
    loading: true,
    playing: true,
    elapsedMs: 0,
    totalMs: note.duration_ms,
  })
  const [scrub, setScrub] = useState<number | null>(null)
  const speed = usePlaybackSpeed()

  const release = useRef(onRelease)
  useEffect(() => {
    release.current = onRelease
  }, [onRelease])

  useEffect(() => {
    const element = new Audio(note.url)
    element.preload = "auto"
    audio.current = element

    const handle = {
      pause: () => {
        element.pause()
        setStatus((current) => ({ ...current, playing: false }))
      },
    }
    claimPlayback(handle)

    const onReady = () => {
      setStatus((current) => ({
        ...current,
        loading: false,
        totalMs:
          Number.isFinite(element.duration) && element.duration > 0
            ? element.duration * 1000
            : note.duration_ms,
      }))
      void element.play().catch(() => release.current())
    }
    const onTime = () =>
      setStatus((current) => ({
        ...current,
        elapsedMs: element.currentTime * 1000,
      }))
    const onEnded = () => release.current()

    element.addEventListener("loadedmetadata", onReady, { once: true })
    element.addEventListener("timeupdate", onTime)
    element.addEventListener("ended", onEnded)
    element.addEventListener("error", onEnded)

    return () => {
      element.pause()
      element.removeEventListener("loadedmetadata", onReady)
      element.removeEventListener("timeupdate", onTime)
      element.removeEventListener("ended", onEnded)
      element.removeEventListener("error", onEnded)
      element.src = ""
      releasePlayback(handle)
      audio.current = null
    }
  }, [note.url, note.duration_ms])

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed
  }, [speed, status.loading])

  const toggle = useCallback(() => {
    const element = audio.current
    if (!element || status.loading) {
      release.current()
      return
    }
    if (status.playing) {
      element.pause()
      setStatus((current) => ({ ...current, playing: false }))
      return
    }
    claimPlayback({
      pause: () => {
        element.pause()
        setStatus((current) => ({ ...current, playing: false }))
      },
    })
    void element.play()
    setStatus((current) => ({ ...current, playing: true }))
  }, [status.loading, status.playing])

  const seek = useCallback(
    (fraction: number) => {
      const element = audio.current
      setScrub(null)
      if (!element || status.loading) return
      element.currentTime = (status.totalMs / 1000) * fraction
      setStatus((current) => ({
        ...current,
        elapsedMs: status.totalMs * fraction,
      }))
    },
    [status.loading, status.totalMs]
  )

  const played =
    status.totalMs > 0 ? Math.min(1, status.elapsedMs / status.totalMs) : 0

  return {
    playing: status.playing,
    loading: status.loading,
    progress: scrub ?? played,
    toggle,
    speed,
    cycleSpeed: cyclePlaybackSpeed,
    scrubbing: scrub !== null,
    beginScrub: setScrub,
    moveScrub: setScrub,
    endScrub: seek,
    elapsedMs:
      scrub !== null
        ? status.totalMs * scrub
        : status.playing || status.elapsedMs > 0
          ? status.elapsedMs
          : status.totalMs,
  }
}
