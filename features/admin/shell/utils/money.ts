const NAIRA = /^(-)?(\d+)(?:\.(\d{1,2}))?$/

/**
 * A naira amount someone typed, in kobo, or null when it is not a usable amount. Commas and
 * spaces are ignored; more than two decimal places is refused rather than rounded, because a
 * rounded amount is not the amount they typed.
 */
export function parseNaira(
  raw: string,
  { allowNegative = false }: { allowNegative?: boolean } = {}
): number | null {
  const match = NAIRA.exec(raw.replace(/[\s,]/g, ""))
  if (!match) return null

  const [, minus, whole, fraction = ""] = match
  if (minus && !allowNegative) return null

  const kobo = Number(whole) * 100 + Number(fraction.padEnd(2, "0"))

  return minus ? -kobo : kobo
}

export type BalanceChange =
  | { ok: true; delta: number; next: number }
  | { ok: false; message: string | null }

/**
 * What a typed adjustment would do to a balance. Neither earnings nor a wallet can go below
 * zero, so that is refused here rather than by a failed request.
 */
export function previewAdjustment(balance: number, raw: string): BalanceChange {
  if (raw.trim() === "") return { ok: false, message: null }

  const delta = parseNaira(raw, { allowNegative: true })
  if (delta === null) {
    return { ok: false, message: "Enter an amount like 500 or -250.50." }
  }
  if (delta === 0)
    return { ok: false, message: "Enter an amount other than zero." }
  if (balance + delta < 0) {
    return { ok: false, message: "That would take them below zero." }
  }

  return { ok: true, delta, next: balance + delta }
}
