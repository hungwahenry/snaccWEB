"use client"

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
} from "react"

const MAX_SCALE = 4
const STEP_SCALE = 2.5
const SNAP_BACK_SCALE = 1.05
const SWITCH_AT = 60
const CLOSE_AT = 110

export type ImageSwipe = "next" | "previous" | "close"

interface Point {
  x: number
  y: number
}

function clamp(value: number, limit: number): number {
  return Math.min(Math.max(value, -limit), limit)
}

function spread(points: Point[]): number {
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
}

export function swipeOf(dx: number, dy: number): ImageSwipe | null {
  if (dy > CLOSE_AT && dy > Math.abs(dx)) return "close"
  if (Math.abs(dx) < SWITCH_AT || Math.abs(dx) <= Math.abs(dy)) return null
  return dx < 0 ? "next" : "previous"
}

export function useImageZoom(onSwipe?: (swipe: ImageSwipe) => void) {
  const [box, setBox] = useState<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [drag, setDrag] = useState<Point | null>(null)
  const [pinching, setPinching] = useState(false)
  const pointers = useRef(new Map<number, Point>())
  const pinch = useRef<{ spread: number; scale: number } | null>(null)
  const swipe = useRef<Point | null>(null)

  const bound = useCallback(
    (next: number, at: Point) => {
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

  function release(event: PointerEvent<HTMLElement>, finished: boolean) {
    const origin = finished ? swipe.current : null
    pointers.current.delete(event.pointerId)
    swipe.current = null
    setDrag(null)

    if (pinch.current) {
      if (pointers.current.size < 2) {
        pinch.current = null
        setPinching(false)
        if (scale < SNAP_BACK_SCALE) reset()
      }
      return
    }

    if (!origin || zoomed) return
    const found = swipeOf(event.clientX - origin.x, event.clientY - origin.y)
    if (found) onSwipe?.(found)
  }

  return {
    attach: setBox,
    zoomed,
    reset,
    style: {
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
      transition: drag || pinching ? "none" : "transform 160ms ease-out",
    },
    handlers: {
      onDoubleClick: () => zoomTo(zoomed ? 1 : STEP_SCALE),
      onWheel: (event: WheelEvent) => {
        if (!event.ctrlKey && !zoomed) return
        zoomTo(scale - event.deltaY / 300)
      },
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        if (event.button !== 0) return
        const at = { x: event.clientX, y: event.clientY }
        pointers.current.set(event.pointerId, at)
        event.currentTarget.setPointerCapture(event.pointerId)

        if (pointers.current.size === 2) {
          pinch.current = {
            spread: spread([...pointers.current.values()]),
            scale,
          }
          swipe.current = null
          setDrag(null)
          setPinching(true)
          return
        }

        if (zoomed) setDrag(at)
        else if (event.pointerType !== "mouse") swipe.current = at
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        if (!pointers.current.has(event.pointerId)) return
        pointers.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        })

        const held = pinch.current
        if (held && pointers.current.size === 2 && held.spread > 0) {
          const now = spread([...pointers.current.values()])
          zoomTo(held.scale * (now / held.spread))
          return
        }

        if (!drag) return
        const dx = event.clientX - drag.x
        const dy = event.clientY - drag.y
        setDrag({ x: event.clientX, y: event.clientY })
        setOffset((current) =>
          bound(scale, { x: current.x + dx, y: current.y + dy })
        )
      },
      onPointerUp: (event: PointerEvent<HTMLElement>) => release(event, true),
      onPointerCancel: (event: PointerEvent<HTMLElement>) =>
        release(event, false),
    },
  }
}
