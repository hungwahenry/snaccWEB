import type { Money } from "@/lib/money"

export type EngagementSource = "server" | "client"

export interface AdminEngagementKind {
  key: string
  label: string
  description: string
  source: EngagementSource
  score_weight: number | null
  feed_weight: number | null
  earn_amounts: Money[]
  default_score_weight: number | null
  default_feed_weight: number | null
  is_default: boolean
  enabled: boolean
  position: number
}

export interface UpdateEngagementInput {
  scoreWeight?: number | null
  feedWeight?: number | null
  enabled?: boolean
}

export type EngagementWeight = "scoreWeight" | "feedWeight"

export type EngagementDraft = Record<EngagementWeight, string>

export type WeightParse =
  { ok: true; value: number | null } | { ok: false; message: string }

export interface EngagementGroup {
  source: EngagementSource
  title: string
  description: string
  kinds: AdminEngagementKind[]
}
