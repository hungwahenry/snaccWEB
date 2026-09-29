export type DashboardPeriod = "7" | "30" | "90"

export type DashboardTab =
  | "overview"
  | "audience"
  | "content"
  | "money"
  | "notifications"
  | "safety"
  | "campuses"

export type DashboardParams = {
  days: number
  campusId?: string
}

export interface DashboardSeriesPoint {
  date: string
  signups: number
  posts: number
  active: number
}

export type SeriesMetric = Exclude<keyof DashboardSeriesPoint, "date">

export interface PeriodTotals {
  signups: number
  posts: number
  active: number
}

export interface TopReaction {
  emoji: string
  count: number
}

export interface DashboardMetrics {
  platform: boolean
  days: number
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
  campuses: { total: number; funded: number }
  top_reactions: TopReaction[]
  series: DashboardSeriesPoint[]
  totals: PeriodTotals
}

export interface BreakdownKey {
  key: string
  label: string
}

export type BreakdownPoint = Record<string, number | string> & { date: string }

export interface Breakdown {
  keys: BreakdownKey[]
  series: BreakdownPoint[]
}

export interface BreakdownTotal extends BreakdownKey {
  total: number
}

export type AudiencePlatform = "android" | "ios" | "web" | "unknown"

export interface AudiencePoint {
  date: string
  dau: number
  wau: number
  mau: number
  new_users: number
  returning: number
}

export interface PlatformVersion {
  version: string
  users: number
}

export interface PlatformMix {
  platform: AudiencePlatform
  users: number
  versions: PlatformVersion[]
}

export interface PushReach {
  platform: Exclude<AudiencePlatform, "unknown">
  users: number
}

export interface Cohort {
  week: string
  size: number
  active: number[]
}

export interface AudienceMetrics {
  summary: {
    active_yesterday: number
    weekly: number
    monthly: number
    stickiness: number
  }
  series: AudiencePoint[]
  platforms: PlatformMix[]
  push: PushReach[]
  retention: Cohort[]
}

export interface RetentionCell {
  users: number
  fraction: number
}

export interface RetentionRow {
  week: string
  size: number
  cells: (RetentionCell | null)[]
}

export interface GrowthMetrics {
  signed_up: number
  onboarded: number
  posted: number
  reacted: number
  followed: number
  returned: number
}

export interface FunnelStep {
  key: keyof GrowthMetrics
  label: string
  count: number
  fraction: number
}

export interface HashtagUse {
  tag: string
  uses: number
}

export interface TopPost {
  id: string
  body: string | null
  username: string | null
  reactions: number
  comments: number
  resnaccs: number
  views: number
}

export interface ContentMetrics {
  posted: Breakdown
  interactions: Breakdown
  views: Breakdown
  hashtags: HashtagUse[]
  top_posts: TopPost[]
}

export interface WithdrawalStatusCount {
  status: "pending" | "success" | "failed" | "reversed"
  count: number
  amount: number
}

export interface EarningTypeTotal {
  type: string
  label: string
  count: number
  amount: number
}

export interface PremiumStoreRow {
  store: string
  label: string
  active: number
  started: number
  lapsed: number
}

export interface MoneyMetrics {
  total_distributed: number
  wallet_liability: number
  withdrawals_by_status: WithdrawalStatusCount[]
  earnings_by_type: EarningTypeTotal[]
  earnings: Breakdown
  wallet: Breakdown
  withdrawals: Breakdown
  premium: PremiumStoreRow[]
}

export interface NotificationTypeRow {
  type: string
  label: string
  sent: number
  pushed: number
  read: number
}

export interface NotificationMetrics {
  flow: Breakdown
  sections: Breakdown
  types: NotificationTypeRow[]
}

export interface ReportReasonRow {
  label: string
  total: number
  open: number
  actioned: number
  dismissed: number
}

export interface ScanRow {
  surface: string
  label: string
  scanned: number
  flagged: number
  acted: number
  failed: number
}

export interface SafetyMetrics {
  reports: Breakdown
  reasons: ReportReasonRow[]
  review: {
    reviewed: number
    median_hours: number | null
    from_people: number
    from_scans: number
    open_now: number
  }
  scans: ScanRow[]
  suspensions: { suspended_now: number; suspended_in_period: number }
}

export interface CampusRow {
  id: string
  name: string
  acronym: string
  members: number
  joined: number
  weekly_active: number
  posts: number
  funded: boolean
}

export interface CampusMetrics {
  items: CampusRow[]
}
