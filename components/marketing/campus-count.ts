const FALLBACK = "Campuses across Nigeria"

export function campusCountLabel(total: number | null): string {
  if (!total || total < 10) return FALLBACK
  const rounded = Math.floor(total / 10) * 10
  return `Students at ${rounded}+ campuses`
}
