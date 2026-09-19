"use client"

import { useEffect, useRef, type MouseEvent, type PointerEvent } from "react"

const HOLD_MS = 350
const DOUBLE_TAP_MS = 250

interface ClipGestures {
  onTap: () => void
  onDoubleTap: (x: number, y: number) => void
  onHold: (held: boolean) => void
}

export function useClipGestures({ onTap, onDoubleTap, onHold }: ClipGestures) {
  const tap = useRef<number | null>(null)
  const hold = useRef<number | null>(null)
  const held = useRef(false)

  useEffect(
    () => () => {
      if (tap.current !== null) window.clearTimeout(tap.current)
      if (hold.current !== null) window.clearTimeout(hold.current)
    },
    []
  )

  function release(clickFollows: boolean) {
    if (hold.current !== null) {
      window.clearTimeout(hold.current)
      hold.current = null
    }
    if (!held.current) return

    onHold(false)
    held.current = clickFollows
  }

  return {
    onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return
      held.current = false
      hold.current = window.setTimeout(() => {
        hold.current = null
        held.current = true
        onHold(true)
      }, HOLD_MS)
    },
    onPointerUp: () => release(true),
    onPointerCancel: () => release(false),
    onPointerLeave: () => release(false),
    onClick(event: MouseEvent<HTMLElement>) {
      if (held.current) {
        held.current = false
        return
      }

      if (tap.current === null) {
        tap.current = window.setTimeout(() => {
          tap.current = null
          onTap()
        }, DOUBLE_TAP_MS)
        return
      }

      window.clearTimeout(tap.current)
      tap.current = null
      const box = event.currentTarget.getBoundingClientRect()
      onDoubleTap(event.clientX - box.left, event.clientY - box.top)
    },
    onContextMenu: (event: MouseEvent) => event.preventDefault(),
  }
}
