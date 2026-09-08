"use client"

import { useRef, useState, type PointerEvent } from "react"
import { clamp, type Size } from "../utils/geometry"

export interface TextDraft {
  text: string
  x: number
  y: number
  size: number
  editing: boolean
}

export function useTextDraft(bounds: Size, defaultSize: number) {
  const [draft, setDraft] = useState<TextDraft | null>(null)
  const last = useRef<{ x: number; y: number } | null>(null)

  function begin(at: { x: number; y: number }) {
    setDraft({ text: "", x: at.x, y: at.y, size: defaultSize, editing: true })
  }

  function reopen(existing: {
    text: string
    x: number
    y: number
    size: number
  }) {
    setDraft({ ...existing, editing: true })
  }

  function write(text: string) {
    setDraft((current) => (current ? { ...current, text } : current))
  }

  function settle() {
    setDraft((current) => (current ? { ...current, editing: false } : current))
  }

  function resize(size: number) {
    setDraft((current) => (current ? { ...current, size } : current))
  }

  function discard() {
    setDraft(null)
  }

  // A settled block drags anywhere within the picture.
  const drag = {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (!draft || draft.editing) return
      event.currentTarget.setPointerCapture(event.pointerId)
      last.current = { x: event.clientX, y: event.clientY }
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      const previous = last.current
      if (!previous) return
      const dx = event.clientX - previous.x
      const dy = event.clientY - previous.y
      last.current = { x: event.clientX, y: event.clientY }
      setDraft((current) =>
        current
          ? {
              ...current,
              x: clamp(current.x + dx, 0, bounds.width),
              y: clamp(current.y + dy, 0, bounds.height),
            }
          : current
      )
    },
    onPointerUp() {
      last.current = null
    },
    onPointerCancel() {
      last.current = null
    },
  }

  return {
    draft,
    begin,
    reopen,
    write,
    settle,
    resize,
    discard,
    ready: (draft?.text.trim().length ?? 0) > 0,
    drag,
  }
}
