"use client"

import { useCallback, useMemo, useState } from "react"
import { barCount } from "../components/voice-bars"
import type { VoiceNote } from "../types"
import { levelsFor } from "../utils/levels"

export const WAVE_WIDTH = 132
export const WAVE_HEIGHT = 26

export function useVoiceNote(note: VoiceNote) {
  const [engagedId, setEngagedId] = useState<string | null>(null)
  const [width, setWidth] = useState(WAVE_WIDTH)

  const measure = useCallback((node: HTMLElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.contentRect.width
      if (next > 0)
        setWidth((current) => (Math.abs(current - next) < 1 ? current : next))
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return {
    engaged: engagedId === note.id,
    engage: useCallback(() => setEngagedId(note.id), [note.id]),
    release: useCallback(() => setEngagedId(null), []),
    measure,
    levels: useMemo(
      () => levelsFor(note.id, barCount(width)),
      [note.id, width]
    ),
  }
}
