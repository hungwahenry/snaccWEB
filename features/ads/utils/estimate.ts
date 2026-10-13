import { formatNumber } from "@/lib/format"
import { formatMoney, type Money } from "@/lib/money"
import type { AdReach, BudgetPreset, PriceRange, ReachEstimate } from "../types"

const PER = 1000

export function viewsFor(budget: Money, pricePerThousand: Money): number {
  if (budget.amount <= 0 || pricePerThousand.amount <= 0) return 0
  return Math.floor((budget.amount / pricePerThousand.amount) * PER)
}

function priceLine(price: PriceRange): string {
  const range =
    price.min.amount === price.max.amount
      ? formatMoney(price.min)
      : `${formatMoney(price.min)}–${formatMoney(price.max)}`
  return `${range} per 1,000 views`
}

export function viewsRange(budget: Money, price: PriceRange): string | null {
  const fewest = viewsFor(budget, price.max)
  const most = viewsFor(budget, price.min)
  if (most === 0) return null
  return fewest === most
    ? formatNumber(most)
    : `${formatNumber(fewest)}–${formatNumber(most)}`
}

function viewsLine(budget: Money, price: PriceRange): string | null {
  const range = viewsRange(budget, price)
  return range ? `About ${range} views` : null
}

export function estimateOf(reach: AdReach, budget: Money): ReachEstimate {
  return {
    people: `Reaches about ${formatNumber(reach.people)} ${reach.people === 1 ? "person" : "people"} active this month`,
    price: priceLine(reach.price_per_thousand),
    views: viewsLine(budget, reach.price_per_thousand),
  }
}

export function budgetPresets(
  presets: Money[],
  price: PriceRange | null
): BudgetPreset[] {
  return presets
    .filter((preset) => preset.amount > 0)
    .map((amount) => ({
      amount,
      label: formatMoney(amount),
      views: price ? viewsLine(amount, price) : null,
    }))
}
