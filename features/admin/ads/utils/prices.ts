import { parseAmount } from "@/features/admin/shell/utils/money"
import { formatMoney, money, type Money } from "@/lib/money"

const PRICE_STEP = 1000

function step(currency: string): Money {
  return money(PRICE_STEP, currency)
}

export function priceInvalid(currency: string): string {
  const smallest = formatMoney(step(currency))
  return `Enter an amount in steps of ${smallest}. The lowest is ${smallest}.`
}

export function priceHint(currency: string): string {
  return `In steps of ${formatMoney(step(currency))}.`
}

export function toPrice(raw: string, currency: string): Money | null {
  const price = parseAmount(raw, currency)
  if (price === null || price.amount < PRICE_STEP) return null

  return price.amount % PRICE_STEP === 0 ? price : null
}

export function priceProblem(raw: string, currency: string): string | null {
  return raw.trim() !== "" && toPrice(raw, currency) === null
    ? priceInvalid(currency)
    : null
}
