import { parseNaira } from "@/features/admin/shell/utils/money"

export const PRICE_STEP_KOBO = 1000

export const PRICE_INVALID =
  "Enter naira in steps of ₦10, like 1000 or 1250. The lowest is ₦10."

export function toPriceKobo(raw: string): number | null {
  const kobo = parseNaira(raw)
  if (kobo === null || kobo < PRICE_STEP_KOBO) return null

  return kobo % PRICE_STEP_KOBO === 0 ? kobo : null
}

export function priceProblem(raw: string): string | null {
  return raw.trim() !== "" && toPriceKobo(raw) === null ? PRICE_INVALID : null
}
