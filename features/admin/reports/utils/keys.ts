import type { ReportListQuery } from "../types"

export const adminReportKeys = {
  all: () => ["admin", "reports"] as const,
  list: (query: ReportListQuery) =>
    ["admin", "reports", "list", query] as const,
  detail: (id: string) => ["admin", "reports", "detail", id] as const,
}
