"use client"

import { useEffect, useState, type RefObject } from "react"

const EVENTS = ["timeupdate", "seeked", "emptied"] as const

export function usePlayhead(
  video: RefObject<HTMLVideoElement | null>,
  enabled: boolean
) {
  const [ms, setMs] = useState(0)

  useEffect(() => {
    const element = video.current
    if (!element || !enabled) return

    const read = () => setMs(element.currentTime * 1000)
    EVENTS.forEach((name) => element.addEventListener(name, read))

    return () => {
      EVENTS.forEach((name) => element.removeEventListener(name, read))
    }
  }, [video, enabled])

  return { ms: enabled ? ms : 0, jumpTo: setMs }
}
