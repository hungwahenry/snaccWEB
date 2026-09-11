import type { MomentListQuery } from "../types"

export const adminMomentKeys = {
  all: () => ["admin", "moments"] as const,
  list: (query: MomentListQuery) =>
    ["admin", "moments", "list", query] as const,
}
