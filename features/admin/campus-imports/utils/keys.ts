import type { CampusImportListQuery, CampusImportRowQuery } from "../types"

export const adminCampusImportKeys = {
  all: () => ["admin", "campus-imports"] as const,
  list: (query: CampusImportListQuery) =>
    ["admin", "campus-imports", "list", query] as const,
  detail: (id: string) => ["admin", "campus-imports", "detail", id] as const,
  rows: (id: string, checkedAt: string | null, query: CampusImportRowQuery) =>
    [
      "admin",
      "campus-imports",
      "detail",
      id,
      "rows",
      checkedAt,
      query,
    ] as const,
}
