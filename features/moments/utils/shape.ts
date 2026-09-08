export const AVATAR_SIZE = 56
const RADIUS_RATIO = 0.32

export function squircleRadius(size: number): number {
  return Math.round(size * RADIUS_RATIO)
}
