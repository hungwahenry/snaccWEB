export const BAR_WIDTH = 3
export const BAR_GAP = 3
export const MIN_BAR_HEIGHT = 3

export const WAVE_WIDTH = 132
export const WAVE_HEIGHT = 26

export function barCount(width: number): number {
  return Math.max(1, Math.floor((width + BAR_GAP) / (BAR_WIDTH + BAR_GAP)))
}

/** The newest `slots` levels, right-aligned: quiet bars pad the left until the take fills the row. */
export function trail(levels: number[], slots: number): number[] {
  if (slots <= 0) return []

  return [
    ...Array<number>(Math.max(0, slots - levels.length)).fill(0),
    ...levels.slice(-slots),
  ]
}

export function barLit(
  progress: number,
  index: number,
  total: number
): boolean {
  return progress * total >= index + 1
}
