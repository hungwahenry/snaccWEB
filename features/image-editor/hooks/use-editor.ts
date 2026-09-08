"use client"

import { useState } from "react"
import type { PickedImage } from "@/lib/media"
import { FIXED_RATIOS, type Ratio } from "../types"
import { measureLine } from "../utils/font"
import { fitWithin, type CropRect, type Size } from "../utils/geometry"
import { textAt } from "../utils/hit-test"
import { useEditorGestures } from "./use-editor-gestures"
import { useEditorLayers } from "./use-editor-layers"
import { useEditorSession } from "./use-editor-session"
import { useTextDraft } from "./use-text-draft"

const EMPTY: Size = { width: 0, height: 0 }

export function useEditor(
  image: PickedImage | null,
  onFail: (error: unknown) => void
) {
  const layers = useEditorLayers()
  const session = useEditorSession(image)

  const [ratio, setRatio] = useState<Ratio>("free")
  const [crop, setCrop] = useState<CropRect | null>(null)
  const [stage, setStage] = useState<Size>(EMPTY)

  const working = session.working
  const source = working
    ? { width: working.width, height: working.height }
    : null
  const size = fitWithin(source, stage)
  const cropping = layers.tool === "crop"

  const aspect =
    ratio === "free"
      ? null
      : ratio === "original"
        ? (source?.width ?? 1) / (source?.height ?? 1)
        : FIXED_RATIOS[ratio]

  const text = useTextDraft(size, layers.textSize)

  const [openedFor, setOpenedFor] = useState(image?.uri)
  if (image?.uri !== openedFor) {
    setOpenedFor(image?.uri)
    layers.clear()
    layers.setTool("draw")
    setRatio("free")
    setCrop(null)
    text.discard()
  }

  const gestures = useEditorGestures(layers.tool, {
    onStroke: layers.addStroke,
    onBlur: layers.addBlur,
    onPlaceText: placeText,
  })

  async function chooseTool(next: typeof layers.tool) {
    if (next === "crop" && !cropping) {
      try {
        await session.beginCrop(size, layers.layers)
        layers.clear()
      } catch (error) {
        onFail(error)
        return
      }
    }
    if (text.draft && next !== "text") commitText()
    layers.setTool(next)
  }

  async function rotate() {
    try {
      // The crop box is described against the old edges, which the turn has just swapped.
      setCrop(null)
      await session.rotate()
    } catch (error) {
      onFail(error)
    }
  }

  async function applyCrop() {
    try {
      if (crop) await session.applyCrop(crop)
      setCrop(null)
      layers.setTool("draw")
    } catch (error) {
      onFail(error)
    }
  }

  function placeText(at: { x: number; y: number }) {
    if (text.draft) {
      if (text.draft.editing) {
        text.settle()
        return
      }
      commitText()
    }

    const hit = textAt(at, layers.layers, size, measureLine)
    if (hit) {
      layers.remove(hit.id)
      text.reopen({ text: hit.text, x: hit.x, y: hit.y, size: hit.size })
      return
    }
    text.begin(at)
  }

  function commitText() {
    if (!text.draft) return
    if (text.ready)
      layers.addText(
        text.draft.text.trim(),
        { x: text.draft.x, y: text.draft.y },
        text.draft.size
      )
    text.discard()
  }

  function flatten(): Promise<PickedImage | null> {
    return session.flatten(size, layers.layers)
  }

  return {
    layers,
    working,
    size,
    stage,
    setStage,
    busy: session.busy,
    cropping,
    ratio,
    setRatio,
    aspect,
    setCrop,
    text,
    commitText,
    gestures,
    chooseTool,
    applyCrop,
    rotate,
    flatten,
  }
}

export type Editor = ReturnType<typeof useEditor>
