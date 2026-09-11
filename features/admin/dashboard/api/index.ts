import { api } from "@/lib/api/client"
import type { DashboardMetrics } from "../types"

export function getDashboard() {
  return api.get<DashboardMetrics>("/admin/dashboard")
}
