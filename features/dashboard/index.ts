import { api } from "@/lib/api/client"

export interface DashboardMetrics {
  users: {
    total: number
    verified: number
    suspended: number
    admins: number
    completed_profiles: number
  }
  content: { snaccs: number; deleted_snaccs: number }
  moderation: { open_reports: number }
  money: {
    total_distributed: number
    wallet_liability: number
    pending_withdrawals: { count: number; amount: number }
  }
  campuses: { total: number; funded: number }
}

export function getDashboard() {
  return api.get<DashboardMetrics>("/admin/dashboard")
}
