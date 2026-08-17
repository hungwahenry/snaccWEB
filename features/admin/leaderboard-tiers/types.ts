export interface AdminTier {
  id: string
  key: string
  max_percentile: number
  position: number
  created_at: string
}

export interface CreateTierInput {
  key: string
  maxPercentile: number
  position: number
}

export interface UpdateTierInput {
  key?: string
  maxPercentile?: number
  position?: number
}
