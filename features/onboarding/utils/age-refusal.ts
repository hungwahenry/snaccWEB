export function refusalActive(
  refusedAt: number,
  now: number,
  cooldownMs: number
): boolean {
  return refusedAt > 0 && now - refusedAt < cooldownMs
}
