import type { DashboardParams } from "../types"

export const adminDashboardKeys = {
  all: () => ["admin", "dashboard"] as const,
  section: (section: string, params: DashboardParams) =>
    [...adminDashboardKeys.all(), section, params] as const,
}
