export function tileWidth(
  container: number,
  columns: number,
  gap: number
): number {
  if (container <= 0) return 0
  return Math.floor((container - gap * (columns - 1)) / columns)
}
