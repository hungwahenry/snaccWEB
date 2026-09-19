"use client"

import { useEffect, useRef, useState } from "react"
import { useVoicePlayback } from "@/features/voice/hooks/use-voice-player"
import { claimSound, muteVideo, releaseSound } from "../playback"
import { useStreamedVideo } from "./use-streamed-video"

const OFFSCREEN_SHARE = 0.25

export function useInlineClip(url: string | null) {
  const { ref: video, play } = useStreamedVideo(url)
  const frame = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const voicePlaying = useVoicePlayback()?.status === "playing"

  useEffect(() => {
    if (voicePlaying) video.current?.pause()
  }, [voicePlaying, video])

  useEffect(() => {
    const element = video.current
    const box = frame.current
    if (!element || !box) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < OFFSCREEN_SHARE) element.pause()
      },
      { threshold: [0, OFFSCREEN_SHARE] }
    )
    observer.observe(box)

    return () => {
      observer.disconnect()
      releaseSound(element)
    }
  }, [video, url])

  return {
    frame,
    started,
    playing,
    muted,
    video: {
      ref: video,
      muted,
      onPlay: () => setPlaying(true),
      onPause: () => setPlaying(false),
    },
    toggle: () => {
      const element = video.current
      if (!element) return
      if (!element.paused) {
        element.pause()
        return
      }

      setStarted(true)
      claimSound(element)
      void play().catch(() => undefined)
    },
    toggleMute: () => {
      const element = video.current
      if (element) muteVideo(element, !muted)
      setMuted(!muted)
    },
  }
}
