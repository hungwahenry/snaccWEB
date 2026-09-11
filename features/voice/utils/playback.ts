import type { PlaybackSpeed } from "../types"

type PlaybackHandle = { pause: () => void }

let playing: PlaybackHandle | null = null

/** One voice note at a time: starting one pauses whichever was playing. */
export function claimPlayback(handle: PlaybackHandle): void {
  if (playing && playing !== handle) playing.pause()
  playing = handle
}

export function releasePlayback(handle: PlaybackHandle): void {
  if (playing === handle) playing = null
}

export const PLAYBACK_SPEEDS: readonly PlaybackSpeed[] = [1, 1.5, 2]

export function nextSpeed(speed: PlaybackSpeed): PlaybackSpeed {
  const index = PLAYBACK_SPEEDS.indexOf(speed)

  return PLAYBACK_SPEEDS[(index + 1) % PLAYBACK_SPEEDS.length]
}

/** Where the clock should read: the scrub point while dragging, else the play head, else the full length. */
export function shownElapsed({
  scrub,
  playing,
  elapsedMs,
  totalMs,
}: {
  scrub: number | null
  playing: boolean
  elapsedMs: number
  totalMs: number
}): number {
  if (scrub !== null) return totalMs * scrub
  return playing || elapsedMs > 0 ? elapsedMs : totalMs
}

export function playedFraction(elapsedMs: number, totalMs: number): number {
  return totalMs > 0 ? Math.min(1, Math.max(0, elapsedMs / totalMs)) : 0
}

/** The audio element's own length when it knows it; recorded webm often reports Infinity. */
export function mediaDurationMs(seconds: number, fallbackMs: number): number {
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : fallbackMs
}

/** A pointer's position across an element, as 0–1. */
export function fractionAt(
  clientX: number,
  rect: { left: number; width: number }
): number {
  if (rect.width <= 0) return 0
  return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
}

const STEP = 0.05

/** Keyboard seeking on the waveform; null for keys it doesn't handle. */
export function seekByKey(key: string, fraction: number): number | null {
  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return Math.min(1, fraction + STEP)
    case "ArrowLeft":
    case "ArrowDown":
      return Math.max(0, fraction - STEP)
    case "Home":
      return 0
    case "End":
      return 1
    default:
      return null
  }
}
