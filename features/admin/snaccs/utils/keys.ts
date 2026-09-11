import type { SnaccListQuery } from "../types"

export const adminSnaccKeys = {
  all: () => ["admin", "snaccs"] as const,
  list: (query: SnaccListQuery) => ["admin", "snaccs", "list", query] as const,
  detail: (id: string) => ["admin", "snaccs", "detail", id] as const,
}
