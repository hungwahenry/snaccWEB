"use client"

import type Hls from "hls.js"
import { useCallback, useEffect, useRef, useState } from "react"

const HLS_TYPE = "application/vnd.apple.mpegurl"
const LEAN_BUFFER = { maxBufferLength: 6, maxMaxBufferLength: 12 }

interface StreamOptions {
  eager?: boolean
  lean?: boolean
  onFail?: () => void
}

export function useStreamedVideo(
  url: string | null,
  { eager = false, lean = false, onFail }: StreamOptions = {}
) {
  const video = useRef<HTMLVideoElement>(null)
  const stream = useRef<Hls | null>(null)
  const attached = useRef<string | null>(null)
  const run = useRef(0)
  const fail = useRef(onFail)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    fail.current = onFail
  })

  const attach = useCallback(async () => {
    const element = video.current
    if (!element || !url || attached.current === url) return
    attached.current = url
    run.current += 1
    const mine = run.current

    if (element.canPlayType(HLS_TYPE)) {
      element.src = url
      return
    }

    const { default: HlsPlayer } = await import("hls.js")
    if (mine !== run.current) return

    if (!HlsPlayer.isSupported()) {
      element.src = url
      return
    }

    const player = new HlsPlayer({
      capLevelToPlayerSize: true,
      ...(lean ? LEAN_BUFFER : {}),
    })
    player.on(HlsPlayer.Events.ERROR, (_, data) => {
      if (data.fatal) fail.current?.()
    })
    player.loadSource(url)
    player.attachMedia(element)
    stream.current = player
  }, [url, lean])

  useEffect(() => {
    const element = video.current
    if (eager) void attach()

    return () => {
      run.current += 1
      stream.current?.destroy()
      stream.current = null
      if (attached.current && element) {
        element.removeAttribute("src")
        element.load()
      }
      attached.current = null
    }
  }, [attach, eager, attempt])

  const play = useCallback(async () => {
    await attach()
    await video.current?.play()
  }, [attach])

  const reload = useCallback(() => setAttempt((count) => count + 1), [])

  return { ref: video, play, reload }
}
