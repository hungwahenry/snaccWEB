import type { ReportableType } from "../types"

export const reportKeys = {
  mine: () => ["reports", "mine"] as const,
  reasons: (type: ReportableType) => ["reports", "reasons", type] as const,
}
