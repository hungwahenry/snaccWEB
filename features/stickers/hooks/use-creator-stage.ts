"use client"

import { useCallback, useRef, useState } from "react"
import type { CropRect } from "@/lib/media"

/** The square the photo is framed in, sized to the room below the header, and the frame chosen. */
export function useCreatorStage({
  busy,
  onCreate,
}: {
  busy: boolean
  onCreate: (rect: CropRect) => void
}) {
  const [floor, setFloor] = useState({ width: 0, height: 0 })
  const rect = useRef<CropRect | null>(null)

  const measureFloor = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) =>
      setFloor({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const onCropChange = useCallback((current: CropRect) => {
    rect.current = current
  }, [])

  const next = useCallback(() => {
    if (busy || !rect.current) return
    onCreate(rect.current)
  }, [busy, onCreate])

  return {
    side: Math.min(floor.width, floor.height),
    measureFloor,
    onCropChange,
    next,
  }
}
