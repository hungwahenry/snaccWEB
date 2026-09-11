export function secondsUntil(iso: string, now = Date.now()): number {
  return Math.max(0, Math.floor((Date.parse(iso) - now) / 1000))
}

/** "1h 5m" while there is an hour or more to go, then a ticking "4:05". */
export function countdownLabel(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`
}
