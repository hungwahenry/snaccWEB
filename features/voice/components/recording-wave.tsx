"use client"

import { useCallback, useMemo, useState } from "react"
import { barCount, trail } from "../utils/wave"
import { VoiceBars } from "./voice-bars"

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

  const display = useMemo(() => trail(levels, slots), [levels, slots])

  return (
    <div
      ref={measure}
      className="flex min-w-0 flex-1 items-center justify-end overflow-hidden"
    >
      {display.length > 0 ? (
        <VoiceBars levels={display} height={height} className="bg-primary" />
      ) : null}
    </div>
  )
}
