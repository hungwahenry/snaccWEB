const clampFraction = (fraction: number) => Math.min(1, Math.max(0, fraction))

export function progressPercent(fraction: number): number {
  return Math.round(clampFraction(fraction) * 100)
}

export function ringOffset(fraction: number, circumference: number): number {
  return circumference * (1 - clampFraction(fraction))
}
