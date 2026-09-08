"use client"

import { useSyncExternalStore } from "react"

const SPEEDS = [1, 1.5, 2] as const

export type PlaybackSpeed = (typeof SPEEDS)[number]

let speed: PlaybackSpeed = 1
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function cyclePlaybackSpeed(): void {
  speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]
  listeners.forEach((listener) => listener())
}

export function usePlaybackSpeed(): PlaybackSpeed {
  return useSyncExternalStore(
    subscribe,
    () => speed,
    () => 1
  )
}
