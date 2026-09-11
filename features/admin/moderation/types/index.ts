export type ModerationSurface =
  "snacc" | "comment" | "moment" | "message" | "anon_message" | "profile"

export type ModerationAction = "allow" | "flag" | "hold" | "block"

export type ModerationMode = "inline" | "queued"

export type ModerationTab = "rules" | "surfaces" | "categories" | "reviews"

export interface SurfaceSetting {
  surface: ModerationSurface
  enabled: boolean
  mode: ModerationMode
  timeout_ms: number
  updated_at: string
}

export interface ModerationRule {
  id: string
  surface: ModerationSurface
  category: string
  threshold: number
  action: ModerationAction
  note: string | null
  position: number
  retired: boolean
  created_at: string
  updated_at: string
}

export interface CategoryUsage {
  category: string
  label: string
  description: string
  scores_text: boolean
  scores_image: boolean
  scans: number
  ruled: ModerationSurface[]
  unknown: boolean
}

export interface CategoryInsight {
  category: string
  surface: ModerationSurface
  scans: number
  buckets: { from: number; count: number }[]
  would_catch: { threshold: number; count: number }[]
}

export interface ModerationSummary {
  today: number
  failures: number
  by_surface: {
    surface: ModerationSurface
    verdict: ModerationAction
    count: number
  }[]
}

export interface ModerationScan {
  id: string
  surface: ModerationSurface
  target: {
    snacc_id: string | null
    moment_id: string | null
    message_id: string | null
    user_id: string | null
  }
  model: string
  flagged: boolean
  scores: Record<string, number>
  verdict: ModerationAction
  applied: ModerationAction
  category: string | null
  score: number | null
  rule: { id: string; category: string; action: ModerationAction } | null
  report_id: string | null
  error: string | null
  latency_ms: number | null
  created_at: string
}

export interface RuleInput {
  surface: ModerationSurface
  category: string
  threshold: number
  action: ModerationAction
  note?: string
  position?: number
}

export type RuleChanges = Partial<RuleInput> & { retired?: boolean }

export type SurfaceChanges = Partial<
  Pick<SurfaceSetting, "enabled" | "mode">
> & { timeoutMs?: number }

export type ScanQuery = {
  page: number
  verdict?: ModerationAction
}

export interface RuleDraft {
  surface: ModerationSurface
  category: string
  threshold: string
  action: ModerationAction
  note: string
}

export interface ModerationTotals {
  reviewed: number
  today: number
  acted: number
  live: number
  surfaces: number
  failures: number
  unruled: number
}

export interface InsightBar {
  from: number
  label: string
  count: number
  fraction: number
  catching: boolean
}
