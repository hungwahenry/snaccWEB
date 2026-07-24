import { api } from "@/lib/api/client"

export interface DashboardSeriesPoint {
  date: string
  signups: number
  snaccs: number
  active: number
}

export interface DashboardMetrics {
  users: {
    total: number
    verified: number
    suspended: number
    admins: number
    completed_profiles: number
  }
  content: {
    snaccs: number
    comments: number
    resnaccs: number
    deleted_snaccs: number
    with_image: number
    with_gif: number
  }
  engagement: { reactions: number; views: number; follows: number }
  moderation: {
    open_reports: number
    actioned: number
    dismissed: number
    reports_7d: number
  }
  money: {
    total_distributed: number
    wallet_liability: number
    withdrawals_by_status: {
      status: "pending" | "success" | "failed" | "reversed"
      count: number
      amount: number
    }[]
    earnings_by_type: { type: "reaction" | "resnacc"; count: number; amount: number }[]
  }
  campuses: { total: number; funded: number }
  top_campuses: { id: string; name: string; acronym: string; members: number; snaccs: number }[]
  top_reactions: { emoji: string; count: number }[]
  series: DashboardSeriesPoint[]
}

export function getDashboard() {
  return api.get<DashboardMetrics>("/admin/dashboard")
}
