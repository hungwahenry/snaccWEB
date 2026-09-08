"use client"

import { useRef, useState, type PointerEvent } from "react"
import type { Tool } from "../types"

type Handlers = {
  onStroke: (path: string) => void
  onBlur: (path: string) => void
  onPlaceText: (at: { x: number; y: number }) => void
}

const TAP_SLOP = 6

/// Draw and blur are drags; text is a tap. All in the canvas's own coordinates.
export function useEditorGestures(tool: Tool, handlers: Handlers) {
  const [live, setLive] = useState<string | null>(null)
  const path = useRef("")
  const origin = useRef<{ x: number; y: number } | null>(null)
  const moved = useRef(false)

  function local(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }

  function down(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const at = local(event)
    origin.current = at
    moved.current = false
    if (tool === "draw" || tool === "blur") {
      path.current = `M ${at.x} ${at.y}`
      setLive(path.current)
    }
  }

  function move(event: PointerEvent<HTMLElement>) {
    if (!origin.current) return
    const at = local(event)
    if (Math.hypot(at.x - origin.current.x, at.y - origin.current.y) > TAP_SLOP)
      moved.current = true
    if (tool === "draw" || tool === "blur") {
      path.current += ` L ${at.x} ${at.y}`
      setLive(path.current)
    }
  }

  function up(event: PointerEvent<HTMLElement>) {
    const start = origin.current
    origin.current = null
    if (!start) return

    if (tool === "draw" || tool === "blur") {
      if (tool === "draw") handlers.onStroke(path.current)
      else handlers.onBlur(path.current)
      setLive(null)
      return
    }

    if (tool === "text" && !moved.current) handlers.onPlaceText(local(event))
  }

  return {
    live,
    handlers: {
      onPointerDown: down,
      onPointerMove: move,
      onPointerUp: up,
      onPointerCancel: () => {
        origin.current = null
        setLive(null)
      },
    },
  }
}
