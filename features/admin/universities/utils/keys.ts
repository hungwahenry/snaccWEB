import type { UniversityListQuery } from "../types"

export const adminUniversityKeys = {
  all: () => ["admin", "universities"] as const,
  list: (query: UniversityListQuery) =>
    ["admin", "universities", "list", query] as const,
  everything: () => ["admin", "universities", "everything"] as const,
}
