export interface DashboardSeriesPoint {
  date: string
  signups: number
  snaccs: number
  active: number
}

export type SeriesMetric = Exclude<keyof DashboardSeriesPoint, "date">

export interface WithdrawalStatusCount {
  status: "pending" | "success" | "failed" | "reversed"
  count: number
  amount: number
}

export interface EarningTypeTotal {
  type: "reaction" | "resnacc"
  count: number
  amount: number
}

export interface DashboardMoney {
  total_distributed: number
  wallet_liability: number
  withdrawals_by_status: WithdrawalStatusCount[]
  earnings_by_type: EarningTypeTotal[]
}

export interface TopCampus {
  id: string
  name: string
  acronym: string
  members: number
  snaccs: number
}

export interface TopReaction {
  emoji: string
  count: number
}

export interface DashboardMetrics {
  platform: boolean
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
  money: DashboardMoney | null
  campuses: { total: number; funded: number }
  top_campuses: TopCampus[]
  top_reactions: TopReaction[]
  series: DashboardSeriesPoint[]
}
