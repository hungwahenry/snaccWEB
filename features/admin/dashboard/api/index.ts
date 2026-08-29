import type { DashboardMetrics } from "../types"
import { api } from "@/lib/api/client"

export function getDashboard() {
  return api.get<DashboardMetrics>("/admin/dashboard")
}
