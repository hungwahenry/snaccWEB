/**
 * A whole number someone typed, or null when it is blank, not a whole number, or out of range.
 * `Number(x) || 0` turns a typo into 0 without a word; this refuses it instead.
 */
export function parseWholeNumber(
  raw: string,
  { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}
): number | null {
  const text = raw.trim()
  if (!/^-?\d+$/.test(text)) return null

  const value = Number(text)

  return value >= min && value <= max ? value : null
}
