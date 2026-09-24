import type { ReferralListQuery } from "../types"

export const adminReferralKeys = {
  all: () => ["admin", "referrals"] as const,
  list: (query: ReferralListQuery) =>
    ["admin", "referrals", "list", query] as const,
}
