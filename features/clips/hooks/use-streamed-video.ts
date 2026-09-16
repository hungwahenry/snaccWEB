"use client"

import type Hls from "hls.js"
import { useCallback, useEffect, useRef } from "react"

const HLS_TYPE = "application/vnd.apple.mpegurl"

export function useStreamedVideo(url: string | null, eager = false) {
  const video = useRef<HTMLVideoElement>(null)
  const stream = useRef<Hls | null>(null)
  const attached = useRef<string | null>(null)

  const attach = useCallback(async () => {
    const element = video.current
    if (!element || !url || attached.current === url) return
    attached.current = url

    if (element.canPlayType(HLS_TYPE)) {
      element.src = url
      return
    }

    const { default: HlsPlayer } = await import("hls.js")
    if (!HlsPlayer.isSupported()) {
      element.src = url
      return
    }

    const player = new HlsPlayer({ capLevelToPlayerSize: true })
    player.loadSource(url)
    player.attachMedia(element)
    stream.current = player
  }, [url])

  useEffect(() => {
    if (eager) void attach()

    return () => {
      stream.current?.destroy()
      stream.current = null
      attached.current = null
    }
  }, [attach, eager])

  const play = useCallback(async () => {
    await attach()
    await video.current?.play()
  }, [attach])

  return { ref: video, play }
}
