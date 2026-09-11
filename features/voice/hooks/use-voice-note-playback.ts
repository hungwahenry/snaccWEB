"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { showErrorMessage } from "@/lib/feedback"
import type { VoiceNote } from "../types"
import {
  claimPlayback,
  mediaDurationMs,
  playedFraction,
  releasePlayback,
  shownElapsed,
} from "../utils/playback"
import {
  currentPlaybackSpeed,
  cyclePlaybackSpeed,
  usePlaybackSpeed,
} from "./use-playback-speed"

type Status = {
  loading: boolean
  playing: boolean
  elapsedMs: number
  totalMs: number
}

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError"
}

/** Plays one note from the moment it mounts; `onRelease` hands the row back to its idle look. */
export function useVoiceNotePlayback(note: VoiceNote, onRelease: () => void) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [status, setStatus] = useState<Status>(() => ({
    loading: true,
    playing: true,
    elapsedMs: 0,
    totalMs: note.duration_ms,
  }))
  const [scrub, setScrub] = useState<number | null>(null)
  const speed = usePlaybackSpeed()

  const release = useRef(onRelease)
  useEffect(() => {
    release.current = onRelease
  }, [onRelease])

  const handle = useMemo(
    () => ({
      pause: () => {
        audio.current?.pause()
        setStatus((current) => ({ ...current, playing: false }))
      },
    }),
    []
  )

  const failed = useRef(false)
  const fail = useCallback((error?: unknown) => {
    if (failed.current || isAbort(error)) return
    failed.current = true
    showErrorMessage("Could not play this voice note.")
    release.current()
  }, [])

  useEffect(() => {
    const element = new Audio(note.url)
    element.preload = "auto"
    element.defaultPlaybackRate = currentPlaybackSpeed()
    element.playbackRate = element.defaultPlaybackRate
    audio.current = element
    failed.current = false
    claimPlayback(handle)

    const onMetadata = () =>
      setStatus((current) => ({
        ...current,
        totalMs: mediaDurationMs(element.duration, note.duration_ms),
      }))
    const onPlaying = () =>
      setStatus((current) => ({ ...current, loading: false, playing: true }))
    const onTime = () =>
      setStatus((current) => ({
        ...current,
        elapsedMs: element.currentTime * 1000,
      }))
    const onEnded = () => release.current()
    const onError = () => fail()

    element.addEventListener("loadedmetadata", onMetadata)
    element.addEventListener("playing", onPlaying)
    element.addEventListener("timeupdate", onTime)
    element.addEventListener("ended", onEnded)
    element.addEventListener("error", onError)
    // Called here rather than after loading so the play still counts as the tap's own (Safari).
    element.play().catch(fail)

    return () => {
      failed.current = true
      element.removeEventListener("loadedmetadata", onMetadata)
      element.removeEventListener("playing", onPlaying)
      element.removeEventListener("timeupdate", onTime)
      element.removeEventListener("ended", onEnded)
      element.removeEventListener("error", onError)
      element.pause()
      element.removeAttribute("src")
      element.load()
      releasePlayback(handle)
      audio.current = null
    }
  }, [note.url, note.duration_ms, handle, fail])

  useEffect(() => {
    const element = audio.current
    if (!element) return
    element.defaultPlaybackRate = speed
    element.playbackRate = speed
  }, [speed])

  const toggle = useCallback(() => {
    const element = audio.current
    if (!element || status.loading) {
      release.current()
      return
    }
    if (status.playing) {
      handle.pause()
      return
    }
    claimPlayback(handle)
    element.play().catch(fail)
    setStatus((current) => ({ ...current, playing: true }))
  }, [status.loading, status.playing, handle, fail])

  const seek = useCallback(
    (fraction: number) => {
      const element = audio.current
      setScrub(null)
      if (!element || status.loading) return
      element.currentTime = (status.totalMs / 1000) * fraction
      setStatus((current) => ({
        ...current,
        elapsedMs: current.totalMs * fraction,
      }))
    },
    [status.loading, status.totalMs]
  )

  const cancelScrub = useCallback(() => setScrub(null), [])

  return {
    playing: status.playing,
    loading: status.loading,
    progress: scrub ?? playedFraction(status.elapsedMs, status.totalMs),
    totalMs: status.totalMs,
    elapsedMs: shownElapsed({ scrub, ...status }),
    speed,
    toggle,
    cycleSpeed: cyclePlaybackSpeed,
    beginScrub: setScrub,
    moveScrub: setScrub,
    endScrub: seek,
    cancelScrub,
  }
}
