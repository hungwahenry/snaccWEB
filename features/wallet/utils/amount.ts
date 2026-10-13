import { inputToMoney, minorDigits, money, type Money } from "@/lib/money"

export const AMOUNT_CAP_UNITS = 10_000_000

export function keypadCap(
  currency: string,
  capUnits = AMOUNT_CAP_UNITS
): Money {
  return money(capUnits * 10 ** minorDigits(currency), currency)
}

export function typeAmount(
  current: string,
  key: string,
  currency: string,
  capUnits = AMOUNT_CAP_UNITS
): string {
  const digits = minorDigits(currency)
  if (key === "back") return current.slice(0, -1)
  if (key === ".") {
    if (digits === 0 || current.includes(".")) return current
    return current === "" ? "0." : `${current}.`
  }
  if (!/^\d$/.test(key)) return current

  const next = current === "0" ? key : current + key
  const [, decimals] = next.split(".")
  if (decimals !== undefined && decimals.length > digits) return current
  if (
    inputToMoney(next, currency).amount > keypadCap(currency, capUnits).amount
  )
    return current
  return next
}

/** A typed amount with thousands grouped, keeping whatever decimals have been typed so far. */
export function groupAmount(raw: string): string {
  if (!raw) return "0"
  const [whole, decimals] = raw.split(".")
  const grouped = String(Number(whole || "0")).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  )
  return decimals === undefined ? grouped : `${grouped}.${decimals}`
}

/** Font sizes in px that keep a long amount on one line. */
export function amountSize(shown: string): { amount: number; symbol: number } {
  if (shown.length <= 6) return { amount: 64, symbol: 34 }
  if (shown.length <= 9) return { amount: 52, symbol: 28 }
  if (shown.length <= 12) return { amount: 40, symbol: 22 }
  return { amount: 32, symbol: 18 }
}
