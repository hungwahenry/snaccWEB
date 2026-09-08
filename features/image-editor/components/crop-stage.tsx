"use client"

import { useEffect, useMemo, useState, type PointerEvent } from "react"
import type { PickedImage } from "@/lib/media"
import { cn } from "@/lib/utils"
import { HANDLE } from "../types"
import {
  boxToSource,
  containBox,
  gripAt,
  moveBox,
  resizeBox,
  startingBox,
  type Box,
  type CropRect,
  type Grip,
  type Size,
} from "../utils/geometry"

const CORNERS: Grip[] = ["tl", "tr", "bl", "br"]
const EDGES: Grip[] = ["t", "r", "b", "l"]
const THIRDS = [1 / 3, 2 / 3]

const CURSOR: Record<Grip, string> = {
  tl: "cursor-nwse-resize",
  br: "cursor-nwse-resize",
  tr: "cursor-nesw-resize",
  bl: "cursor-nesw-resize",
  t: "cursor-ns-resize",
  b: "cursor-ns-resize",
  l: "cursor-ew-resize",
  r: "cursor-ew-resize",
}

type CropStageProps = {
  image: PickedImage
  stage: Size
  aspect: number | null
  onChange: (rect: CropRect) => void
}

type Drag = { kind: "move" } | { kind: "grip"; grip: Grip }

export function CropStage({ image, stage, aspect, onChange }: CropStageProps) {
  const source = useMemo(
    () => ({ width: image.width, height: image.height }),
    [image.width, image.height]
  )
  const display = useMemo(
    () => containBox(source, { width: stage.width, height: stage.height }),
    [source, stage.width, stage.height]
  )
  const [box, setBox] = useState<Box>(() => startingBox(display, aspect))
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
        : resizeBox(current, drag.mode.grip, dx, dy, display, aspect)
    )
  }

  const release = () => setDrag(null)
  const frame = {
    left: box.x,
    top: box.y,
    width: box.width,
    height: box.height,
  }
  // A locked ratio has one degree of freedom, so an edge would fight the corners for it.
  const grips = aspect === null ? [...CORNERS, ...EDGES] : CORNERS

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
        style={frame}
      >
        <img
          src={image.uri}
          alt=""
          draggable={false}
          // Preflight caps every image at 100% of its parent, which here is the crop window.
          className="absolute max-w-none object-contain"
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
        style={frame}
      />

      <div className="pointer-events-none absolute" style={frame}>
        {THIRDS.map((at) => (
          <span
            key={`v${at}`}
            className="absolute inset-y-0 w-px bg-white/25"
            style={{ left: `${at * 100}%` }}
          />
        ))}
        {THIRDS.map((at) => (
          <span
            key={`h${at}`}
            className="absolute inset-x-0 h-px bg-white/25"
            style={{ top: `${at * 100}%` }}
          />
        ))}
      </div>

      {grips.map((grip) => {
        const at = gripAt(grip, box, HANDLE)
        const corner = grip.length === 2
        return (
          <div
            key={grip}
            onPointerDown={grab({ kind: "grip", grip })}
            onPointerMove={move}
            onPointerUp={release}
            onPointerCancel={release}
            className={cn(
              "absolute flex items-center justify-center",
              CURSOR[grip]
            )}
            style={{
              left: at.x,
              top: at.y,
              width: at.width,
              height: at.height,
            }}
          >
            <span
              className={cn(
                "rounded-full bg-white shadow",
                corner ? "size-3.5" : "size-2.5"
              )}
            />
          </div>
        )
      })}
    </div>
  )
}
