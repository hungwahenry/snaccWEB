const MIN_LEVEL = 0.12

export function levelsFor(id: string, count: number): number[] {
  let seed = 0
  for (let i = 0; i < id.length; i += 1)
    seed = (seed * 31 + id.charCodeAt(i)) >>> 0

  return Array.from({ length: count }, (_, index) => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    const noise = (seed % 1000) / 1000
    const envelope = Math.sin((Math.PI * (index + 0.5)) / count)

    return (
      MIN_LEVEL +
      (1 - MIN_LEVEL) * (0.35 + 0.65 * noise) * (0.55 + 0.45 * envelope)
    )
  })
}
