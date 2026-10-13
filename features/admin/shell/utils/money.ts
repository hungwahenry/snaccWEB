import { addMoney, minorDigits, money, type Money } from "@/lib/money"

const AMOUNT = /^(-)?(\d+)(?:\.(\d+))?$/

/**
 * An amount someone typed, in the currency's smallest unit, or null when it is not a usable
 * amount. Commas and spaces are ignored; more decimals than the currency has is refused rather
 * than rounded, because a rounded amount is not the amount they typed.
 */
export function parseAmount(
  raw: string,
  currency: string,
  { allowNegative = false }: { allowNegative?: boolean } = {}
): Money | null {
  const match = AMOUNT.exec(raw.replace(/[\s,]/g, ""))
  if (!match) return null

  const [, minus, whole, fraction = ""] = match
  const digits = minorDigits(currency)
  if (minus && !allowNegative) return null
  if (fraction.length > digits) return null

  const amount =
    Number(whole) * 10 ** digits + Number(fraction.padEnd(digits, "0") || "0")

  return money(minus ? -amount : amount, currency)
}

export type BalanceChange =
  | { ok: true; delta: Money; next: Money }
  | { ok: false; message: string | null }

/**
 * What a typed adjustment would do to a balance. Neither earnings nor a wallet can go below
 * zero, so that is refused here rather than by a failed request.
 */
export function previewAdjustment(balance: Money, raw: string): BalanceChange {
  if (raw.trim() === "") return { ok: false, message: null }

  const delta = parseAmount(raw, balance.currency, { allowNegative: true })
  if (delta === null) {
    return { ok: false, message: "Enter an amount like 500 or -250.50." }
  }
  if (delta.amount === 0)
    return { ok: false, message: "Enter an amount other than zero." }
  const next = addMoney(balance, delta)
  if (next.amount < 0) {
    return { ok: false, message: "That would take them below zero." }
  }

  return { ok: true, delta, next }
}
