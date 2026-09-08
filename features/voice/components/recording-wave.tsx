"use client"

import { useCallback, useState } from "react"
import { barCount, VoiceBars } from "./voice-bars"

export function RecordingWave({
  levels,
  height,
}: {
  levels: number[]
  height: number
}) {
  const [slots, setSlots] = useState(0)

  const measure = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) =>
      setSlots(barCount(entry.contentRect.width))
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const display =
    slots > 0
      ? [
          ...Array<number>(Math.max(0, slots - levels.length)).fill(0),
          ...levels.slice(-slots),
        ]
      : []

  return (
    <div
      ref={measure}
      className="flex flex-1 items-center justify-end overflow-hidden"
    >
      {display.length > 0 ? (
        <VoiceBars levels={display} height={height} className="bg-primary" />
      ) : null}
    </div>
  )
}
