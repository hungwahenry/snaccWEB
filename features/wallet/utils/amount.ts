import { nairaToKobo } from "@/lib/format"

/** The most the keypad will type: ₦10m. */
export const AMOUNT_CAP_KOBO = 1_000_000_000

/** Applies one keypad press to a typed naira amount, refusing anything that is not money. */
export function typeAmount(
  current: string,
  key: string,
  capKobo = AMOUNT_CAP_KOBO
): string {
  if (key === "back") return current.slice(0, -1)
  if (key === ".") {
    if (current.includes(".")) return current
    return current === "" ? "0." : `${current}.`
  }
  if (!/^\d$/.test(key)) return current

  const next = current === "0" ? key : current + key
  const [, decimals] = next.split(".")
  if (decimals !== undefined && decimals.length > 2) return current
  if (nairaToKobo(next) > capKobo) return current
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
export function amountSize(shown: string): { amount: number; naira: number } {
  if (shown.length <= 6) return { amount: 64, naira: 34 }
  if (shown.length <= 9) return { amount: 52, naira: 28 }
  if (shown.length <= 12) return { amount: 40, naira: 22 }
  return { amount: 32, naira: 18 }
}
