"use client"

import { useSyncExternalStore } from "react"
import type { PlaybackSpeed } from "../types"
import { nextSpeed } from "../utils/playback"

let speed: PlaybackSpeed = 1
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function currentPlaybackSpeed(): PlaybackSpeed {
  return speed
}

export function cyclePlaybackSpeed(): void {
  speed = nextSpeed(speed)
  listeners.forEach((listener) => listener())
}

/** One speed for every voice note, so a change carries to the next one played. */
export function usePlaybackSpeed(): PlaybackSpeed {
  return useSyncExternalStore(
    subscribe,
    () => speed,
    () => 1
  )
}
