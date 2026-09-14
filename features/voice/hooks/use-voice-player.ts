"use client"

import { useSyncExternalStore } from "react"
import type { VoiceNote, VoicePlayback, VoiceSource } from "../types"
import { isFromSource } from "../utils/source"

export interface VoiceDriver {
  load: (note: VoiceNote) => void
  resume: () => void
  pause: () => void
  seek: (ms: number) => void
  unload: () => void
}

type Reported = Partial<
  Pick<VoicePlayback, "status" | "positionMs" | "durationMs">
>

let current: VoicePlayback | null = null
let driver: VoiceDriver | null = null
const listeners = new Set<() => void>()

function set(next: VoicePlayback | null): void {
  current = next
  listeners.forEach((listener) => listener())
}

function patch(change: Reported): void {
  if (!current) return
  const next = { ...current, ...change }
  if (
    next.status === current.status &&
    next.positionMs === current.positionMs &&
    next.durationMs === current.durationMs
  )
    return
  set(next)
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const voicePlayer = {
  play(note: VoiceNote, source: VoiceSource | null): void {
    if (!driver) return
    if (current?.note.id === note.id) {
      if (current.status === "paused") voicePlayer.toggle()
      return
    }
    set({
      note,
      source,
      status: "loading",
      positionMs: 0,
      durationMs: note.duration_ms,
    })
    driver.load(note)
  },

  toggle(): void {
    if (!current) return
    if (current.status === "loading") voicePlayer.stop()
    else if (current.status === "playing") voicePlayer.pause()
    else {
      patch({ status: "playing" })
      driver?.resume()
    }
  },

  seek(fraction: number): void {
    if (!current || current.status === "loading") return
    const ms = current.durationMs * fraction
    driver?.seek(ms)
    patch({ positionMs: ms })
  },

  pause(): void {
    if (!current || current.status === "paused") return
    driver?.pause()
    patch({ status: "paused" })
  },

  stop(): void {
    if (!current) return
    driver?.unload()
    set(null)
  },

  stopIfFrom(from: { snaccId?: string; authorId?: string }): void {
    if (current && isFromSource(current.source, from)) voicePlayer.stop()
  },
}

export function currentVoicePlayback(): VoicePlayback | null {
  return current
}

export function bindVoiceDriver(next: VoiceDriver): () => void {
  driver = next
  return () => {
    if (driver !== next) return
    driver = null
    set(null)
  }
}

export function reportPlayback(noteId: string, change: Reported): void {
  if (current?.note.id === noteId) patch(change)
}

const getSnapshot = () => current
const getServerSnapshot = () => null

export function useVoicePlayback(): VoicePlayback | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useVoicePlaybackOf(noteId: string): VoicePlayback | null {
  return useSyncExternalStore(
    subscribe,
    () => (current?.note.id === noteId ? current : null),
    getServerSnapshot
  )
}
