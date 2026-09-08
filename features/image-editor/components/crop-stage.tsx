"use client"

import { useEffect, useMemo, useState, type PointerEvent } from "react"
import type { PickedImage } from "@/lib/media"
import { HANDLE } from "../types"
import {
  boxToSource,
  containBox,
  cornerAt,
  moveBox,
  resizeBox,
  startingBox,
  type Box,
  type Corner,
  type CropRect,
  type Size,
} from "../utils/geometry"

const CORNERS: Corner[] = ["tl", "tr", "bl", "br"]

type CropStageProps = {
  image: PickedImage
  stage: Size
  aspect: number | null
  onChange: (rect: CropRect) => void
}

type Drag = { kind: "move" } | { kind: "corner"; corner: Corner }

export function CropStage({ image, stage, aspect, onChange }: CropStageProps) {
  const source = useMemo(
    () => ({ width: image.width, height: image.height }),
    [image.width, image.height]
  )
  const display = useMemo(
    () => containBox(source, { width: stage.width, height: stage.height }),
    [source, stage.width, stage.height]
  )
  const [box, setBox] = useState<Box>(display)
  const [drag, setDrag] = useState<{ mode: Drag; x: number; y: number } | null>(
    null
  )

  const [framedFor, setFramedFor] = useState({
    aspect,
    w: display.width,
    h: display.height,
  })
  if (
    framedFor.aspect !== aspect ||
    framedFor.w !== display.width ||
    framedFor.h !== display.height
  ) {
    setFramedFor({ aspect, w: display.width, h: display.height })
    setBox(startingBox(display, aspect))
  }

  useEffect(() => {
    onChange(boxToSource(box, display, source))
  }, [box, display, source, onChange])

  function grab(mode: Drag) {
    return (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return
      event.stopPropagation()
      event.currentTarget.setPointerCapture(event.pointerId)
      setDrag({ mode, x: event.clientX, y: event.clientY })
    }
  }

  function move(event: PointerEvent<HTMLElement>) {
    if (!drag) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    setDrag({ ...drag, x: event.clientX, y: event.clientY })
    setBox((current) =>
      drag.mode.kind === "move"
        ? moveBox(current, dx, dy, display)
        : resizeBox(current, drag.mode.corner, dx, dy, display, aspect)
    )
  }

  const release = () => setDrag(null)

  return (
    <div
      className="relative touch-none select-none"
      style={{ width: stage.width, height: stage.height }}
    >
      <img
        src={image.uri}
        alt=""
        draggable={false}
        className="absolute inset-0 size-full object-contain"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div
        className="pointer-events-none absolute overflow-hidden"
        style={{
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
        }}
      >
        <img
          src={image.uri}
          alt=""
          draggable={false}
          className="absolute object-contain"
          style={{
            width: stage.width,
            height: stage.height,
            left: -box.x,
            top: -box.y,
          }}
        />
      </div>

      <div
        onPointerDown={grab({ kind: "move" })}
        onPointerMove={move}
        onPointerUp={release}
        onPointerCancel={release}
        className="absolute cursor-move border border-white/90"
        style={{
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
        }}
      />

      {CORNERS.map((corner) => {
        const at = cornerAt(corner, box, HANDLE)
        return (
          <div
            key={corner}
            onPointerDown={grab({ kind: "corner", corner })}
            onPointerMove={move}
            onPointerUp={release}
            onPointerCancel={release}
            className="absolute flex cursor-nwse-resize items-center justify-center"
            style={{
              left: at.x,
              top: at.y,
              width: at.width,
              height: at.height,
            }}
          >
            <span className="size-4 rounded-sm border-2 border-white bg-white/25" />
          </div>
        )
      })}
    </div>
  )
}
