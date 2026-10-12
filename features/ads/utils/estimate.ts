import { formatNaira, formatNumber } from "@/lib/format"
import type { AdReach, BudgetPreset, PriceRange, ReachEstimate } from "../types"

const PER = 1000

export function viewsFor(budgetKobo: number, pricePerThousand: number): number {
  if (budgetKobo <= 0 || pricePerThousand <= 0) return 0
  return Math.floor((budgetKobo / pricePerThousand) * PER)
}

function priceLine(price: PriceRange): string {
  const range =
    price.min === price.max
      ? formatNaira(price.min)
      : `${formatNaira(price.min)}–${formatNaira(price.max)}`
  return `${range} per 1,000 views`
}

export function viewsRange(
  budgetKobo: number,
  price: PriceRange
): string | null {
  const fewest = viewsFor(budgetKobo, price.max)
  const most = viewsFor(budgetKobo, price.min)
  if (most === 0) return null
  return fewest === most
    ? formatNumber(most)
    : `${formatNumber(fewest)}–${formatNumber(most)}`
}

function viewsLine(budgetKobo: number, price: PriceRange): string | null {
  const range = viewsRange(budgetKobo, price)
  return range ? `About ${range} views` : null
}

export function estimateOf(reach: AdReach, budgetKobo: number): ReachEstimate {
  return {
    people: `Reaches about ${formatNumber(reach.people)} ${reach.people === 1 ? "person" : "people"} active this month`,
    price: priceLine(reach.price_per_thousand_kobo),
    views: viewsLine(budgetKobo, reach.price_per_thousand_kobo),
  }
}

export function budgetPresets(
  presetsKobo: readonly string[],
  price: PriceRange | null
): BudgetPreset[] {
  return presetsKobo
    .map(Number)
    .filter((kobo) => Number.isInteger(kobo) && kobo > 0)
    .map((kobo) => ({
      kobo,
      label: formatNaira(kobo),
      views: price ? viewsLine(kobo, price) : null,
    }))
}
