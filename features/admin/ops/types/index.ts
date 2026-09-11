export type HealthStatus = "ok" | "degraded"

export type QueueDriver = "redis" | "inline"

export interface OpsHealth {
  status: HealthStatus
  database: { ok: boolean; latency_ms: number }
  queue_driver: QueueDriver
  memory: { rss_mb: number; heap_used_mb: number }
  uptime_seconds: number
  node_version: string
  started_at: string
}

export interface QueueCounts {
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
}

export interface OpsQueue {
  name: string
  counts: QueueCounts | null
}

export interface ProfileCounterDrift {
  snaccs_count: number
  followers_count: number
  following_count: number
  total_views_received: number
  unread_notifications_count: number
}

export interface SnaccCounterDrift {
  reactions_count: number
  resnaccs_count: number
  views_count: number
  comments_count: number
  quotes_count: number
  bookmarks_count: number
  shares_count: number
  author_taps_count: number
  hides_count: number
  reports_count: number
  opens_count: number
  dwell_ms_total: number
}

export interface OpsDrift {
  profiles: ProfileCounterDrift
  snaccs: SnaccCounterDrift
  scores: { score: number; tier: number }
  wallets: { accounts: number }
  earnings: { profiles: number }
  premium: { profiles: number }
}

export type OpsTask = "repair-counters" | "repair-scores" | "repair-wallets"

/** Rows each repair rewrote, keyed by what it rewrote. */
export type OpsRepairResult = Record<string, number>

export interface OpsReconcile {
  withdrawals: {
    checked: number
    settled: number
    failed: number
    waiting: number
  }
  deposits: { checked: number; credited: number }
}

export interface DriftRow {
  key: string
  label: string
  off: number
  repairable: boolean
}
