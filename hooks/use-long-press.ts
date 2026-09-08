"use client"

import { useRef, type PointerEvent, type MouseEvent } from "react"

const DELAY_MS = 450
const SLOP_PX = 10

/// Touch-only long press. Mouse users get hover controls instead, so a mouse never starts the
/// timer. The click that follows a fired press is swallowed so media under the finger stays shut.
export function useLongPress(onLongPress: (() => void) | undefined) {
  const timer = useRef<number | null>(null)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const fired = useRef(false)

  function clear() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
    origin.current = null
  }

  if (!onLongPress) return {}

  return {
    onPointerDown(event: PointerEvent) {
      if (event.pointerType === "mouse") return
      clear()
      fired.current = false
      origin.current = { x: event.clientX, y: event.clientY }
      timer.current = window.setTimeout(() => {
        timer.current = null
        fired.current = true
        onLongPress()
      }, DELAY_MS)
    },
    onPointerMove(event: PointerEvent) {
      const start = origin.current
      if (!start || timer.current === null) return
      if (
        Math.hypot(event.clientX - start.x, event.clientY - start.y) > SLOP_PX
      )
        clear()
    },
    onPointerUp: clear,
    onPointerCancel: clear,
    onPointerLeave: clear,
    onClickCapture(event: MouseEvent) {
      if (!fired.current) return
      fired.current = false
      event.preventDefault()
      event.stopPropagation()
    },
    onContextMenu(event: MouseEvent) {
      if (fired.current || timer.current !== null) event.preventDefault()
    },
  }
}
