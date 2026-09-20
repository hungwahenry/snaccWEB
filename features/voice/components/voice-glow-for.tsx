"use client"

import { useMemo, useRef, type ReactNode } from "react"
import { VoiceBeam } from "voice-glow"
import {
  currentVoicePlayback,
  useVoicePlaybackOf,
} from "../hooks/use-voice-player"
import { approach, levelAt } from "../utils/glow-level"
import { levelsFor } from "../utils/levels"

const STEPS = 64
const RISE = 0.28
const FALL = 0.09

export function useGlowLevel(noteId: string): () => number {
  const eased = useRef(0)
  const levels = useMemo(
    () => (noteId ? levelsFor(noteId, STEPS) : []),
    [noteId]
  )

  return useMemo(() => {
    return () => {
      const now = currentVoicePlayback()
      const live =
        now !== null && now.note.id === noteId && now.status === "playing"
      const target =
        live && now.durationMs > 0
          ? levelAt(levels, now.positionMs / now.durationMs)
          : 0

      eased.current = approach(eased.current, target, RISE, FALL)
      return eased.current
    }
  }, [noteId, levels, eased])
}

export function useNotePlaying(noteId: string): boolean {
  return useVoicePlaybackOf(noteId)?.status === "playing"
}

/** The glow for one note, wrapped round the box that holds it. */
export function VoiceGlowFor({
  noteId,
  type,
  children,
}: {
  noteId: string
  type?: "default" | "pill" | "mobile"
  children: ReactNode
}) {
  const playing = useNotePlaying(noteId)
  const level = useGlowLevel(noteId)

  return (
    <VoiceBeam active={playing} level={level} type={type}>
      {children}
    </VoiceBeam>
  )
}
