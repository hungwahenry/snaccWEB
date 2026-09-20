/** Where the playhead sits in a note's drawn waveform, blended between neighbouring bars. */
export function levelAt(levels: number[], played: number): number {
  if (levels.length === 0) return 0

  const at = Math.min(1, Math.max(0, played)) * (levels.length - 1)
  const index = Math.floor(at)
  const next = Math.min(index + 1, levels.length - 1)

  return levels[index] + (levels[next] - levels[index]) * (at - index)
}

/**
 * One step of an eased follow. The player only reports its position a few times a second, so
 * reading the waveform raw would step; this walks toward it instead, quickly on the way up and
 * slowly on the way down, the way a voice behaves.
 */
export function approach(
  current: number,
  target: number,
  rise: number,
  fall: number
): number {
  const rate = target > current ? rise : fall
  return current + (target - current) * Math.min(1, Math.max(0, rate))
}
