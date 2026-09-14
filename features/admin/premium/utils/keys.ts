import type { SubscriberListQuery } from "../types"

export const adminPremiumKeys = {
  all: () => ["admin", "premium"] as const,
  subscribers: (query: SubscriberListQuery) =>
    ["admin", "premium", "subscribers", query] as const,
  stats: () => ["admin", "premium", "stats"] as const,
  benefits: () => ["admin", "premium", "benefits"] as const,
}
