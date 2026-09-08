"use client"

import { useCallback, useState } from "react"
import { newId } from "@/lib/ids"
import {
  BLUR_WIDTHS,
  PALETTE,
  STROKE_WIDTHS,
  TEXT_SIZES,
  type Layer,
  type Tool,
} from "../types"

export function useEditorLayers() {
  const [layers, setLayers] = useState<Layer[]>([])
  const [tool, setTool] = useState<Tool>("draw")
  const [color, setColor] = useState<string>(PALETTE[0])
  const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTHS[1])
  const [textSize, setTextSize] = useState<number>(TEXT_SIZES[1])
  const [blurWidth, setBlurWidth] = useState<number>(BLUR_WIDTHS[1])

  const add = useCallback(
    (layer: Layer) => setLayers((current) => [...current, layer]),
    []
  )

  const addStroke = useCallback(
    (path: string) =>
      add({ kind: "stroke", id: newId(), path, color, width: strokeWidth }),
    [add, color, strokeWidth]
  )
  const addText = useCallback(
    (text: string, at: { x: number; y: number }, size: number) =>
      add({ kind: "text", id: newId(), text, x: at.x, y: at.y, color, size }),
    [add, color]
  )
  const addBlur = useCallback(
    (path: string) =>
      add({ kind: "blur", id: newId(), path, width: blurWidth }),
    [add, blurWidth]
  )
  const remove = useCallback(
    (id: string) =>
      setLayers((current) => current.filter((layer) => layer.id !== id)),
    []
  )
  const undo = useCallback(
    () => setLayers((current) => current.slice(0, -1)),
    []
  )
  const clear = useCallback(() => setLayers([]), [])

  return {
    layers,
    tool,
    setTool,
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    textSize,
    setTextSize,
    blurWidth,
    setBlurWidth,
    addStroke,
    addText,
    addBlur,
    remove,
    undo,
    clear,
    dirty: layers.length > 0,
  }
}
