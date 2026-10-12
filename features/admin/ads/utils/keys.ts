import type { AdListQuery, PriceListQuery } from "../types"

export const adminAdKeys = {
  campaigns: () => ["admin", "ads", "campaigns"] as const,
  list: (query: AdListQuery) =>
    ["admin", "ads", "campaigns", "list", query] as const,
  stats: () => ["admin", "ads", "campaigns", "stats"] as const,
  detail: (id: string) => ["admin", "ads", "campaigns", "detail", id] as const,
  prices: () => ["admin", "ads", "prices"] as const,
  priceList: (query: PriceListQuery) =>
    ["admin", "ads", "prices", "list", query] as const,
  reasons: () => ["admin", "ads", "reasons"] as const,
  buttons: () => ["admin", "ads", "buttons"] as const,
}
