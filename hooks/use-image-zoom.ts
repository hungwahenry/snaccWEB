"use client"

import {
  useCallback,
  useState,
  type PointerEvent,
  type WheelEvent,
} from "react"

const MAX_SCALE = 4
const STEP_SCALE = 2.5

function clamp(value: number, limit: number): number {
  return Math.min(Math.max(value, -limit), limit)
}

/// Double click or wheel to zoom, drag to pan, the way pinch and double tap work in the app.
export function useImageZoom() {
  const [box, setBox] = useState<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null)

  const bound = useCallback(
    (next: number, at: { x: number; y: number }) => {
      const rect = box?.getBoundingClientRect()
      if (!rect) return at
      return {
        x: clamp(at.x, ((next - 1) * rect.width) / 2),
        y: clamp(at.y, ((next - 1) * rect.height) / 2),
      }
    },
    [box]
  )

  const zoomTo = useCallback(
    (next: number) => {
      const capped = Math.min(Math.max(next, 1), MAX_SCALE)
      setScale(capped)
      setOffset((current) =>
        bound(capped, capped === 1 ? { x: 0, y: 0 } : current)
      )
    },
    [bound]
  )

  const reset = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const zoomed = scale > 1

  const release = () => setDrag(null)

  return {
    attach: setBox,
    zoomed,
    reset,
    style: {
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
      transition: drag ? "none" : "transform 160ms ease-out",
    },
    handlers: {
      onDoubleClick: () => zoomTo(zoomed ? 1 : STEP_SCALE),
      onWheel: (event: WheelEvent) => {
        if (!event.ctrlKey && !zoomed) return
        zoomTo(scale - event.deltaY / 300)
      },
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        if (!zoomed || event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        setDrag({ x: event.clientX, y: event.clientY })
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        if (!drag) return
        const dx = event.clientX - drag.x
        const dy = event.clientY - drag.y
        setDrag({ x: event.clientX, y: event.clientY })
        setOffset((current) =>
          bound(scale, { x: current.x + dx, y: current.y + dy })
        )
      },
      onPointerUp: release,
      onPointerCancel: release,
    },
  }
}
