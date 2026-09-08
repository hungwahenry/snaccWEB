"use client"

import { useEffect, useRef, useState } from "react"
import { sameOriginMedia } from "@/lib/media-url"
import type { Layer } from "../types"
import type { Size } from "../utils/geometry"
import { drawScene, type LiveStroke } from "../utils/render"

export function EditorCanvas({
  uri,
  size,
  layers,
  live,
}: {
  uri: string
  size: Size
  layers: Layer[]
  live: LiveStroke | null
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    let cancelled = false
    const element = new Image()
    element.crossOrigin = "anonymous"
    element.onload = () => {
      if (!cancelled) setImage(element)
    }
    element.src = sameOriginMedia(uri)
    return () => {
      cancelled = true
    }
  }, [uri])

  useEffect(() => {
    const context = canvas.current?.getContext("2d")
    if (!context || !image) return
    drawScene(context, image, size, layers, live)
  }, [image, size, layers, live])

  return (
    <canvas
      ref={canvas}
      width={size.width}
      height={size.height}
      style={{ width: size.width, height: size.height }}
      className="block touch-none select-none"
    />
  )
}
