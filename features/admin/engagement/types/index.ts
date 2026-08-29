export interface AdminEngagementKind {
  key: string
  label: string
  description: string
  source: "server" | "client"
  score_weight: number | null
  feed_weight: number | null
  earn_kobo: number | null
  default_score_weight: number | null
  default_feed_weight: number | null
  default_earn_kobo: number | null
  is_default: boolean
  enabled: boolean
  position: number
}

export interface EngagementChanges {
  scoreWeight?: number | null
  feedWeight?: number | null
  earnKobo?: number | null
  enabled?: boolean
}
