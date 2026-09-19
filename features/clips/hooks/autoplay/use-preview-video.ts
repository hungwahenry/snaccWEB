"use client"

import { useState } from "react"
import { useStreamedVideo } from "../use-streamed-video"

export function usePreviewVideo(url: string) {
  const [shown, setShown] = useState(false)
  const { ref } = useStreamedVideo(url, { eager: true, lean: true })

  return {
    shown,
    video: {
      ref,
      onCanPlay: () => void ref.current?.play().catch(() => undefined),
      onPlaying: () => setShown(true),
    },
  }
}
