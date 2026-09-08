"use client"

import { useCallback, useRef, useState } from "react"
import type { CropRect } from "@/lib/media"
import type { StickerCreator } from "./use-sticker-creator"

type CreatorFlow = Pick<StickerCreator, "busy" | "create">

export function useCreatorStage({ busy, create }: CreatorFlow) {
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

  return {
    side: Math.min(floor.width, floor.height),
    measureFloor,
    next: () => {
      if (busy || !rect.current) return
      create(rect.current)
    },
    onCropChange,
  }
}
