import { clock } from "./clock"

export function playButtonLabel({
  loading,
  playing,
}: {
  loading: boolean
  playing: boolean
}): string {
  if (loading) return "Loading voice note"
  return playing ? "Pause voice note" : "Play voice note"
}

export function speedLabel(speed: number): string {
  return `Playback speed ${speed}x. Change speed`
}

export function positionLabel(elapsedMs: number, totalMs: number): string {
  return `${clock(elapsedMs)} of ${clock(totalMs)}`
}

export function voiceNoteLabel(durationMs: number): string {
  return `Voice note, ${clock(durationMs)}`
}
