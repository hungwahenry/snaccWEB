import type { EarningListQuery } from "../types"

export const adminEarningsKeys = {
  list: (query: EarningListQuery) =>
    ["admin", "earnings", "list", query] as const,
  funds: () => ["admin", "earnings", "funds"] as const,
}
