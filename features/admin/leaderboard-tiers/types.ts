export interface AdminTier {
  id: string
  key: string
  max_percentile: number
  position: number
  label: string
  icon: string
  color: string
  created_at: string
}

export interface CreateTierInput {
  key: string
  maxPercentile: number
  position: number
  label?: string
  icon?: string
  color?: string
}

export interface UpdateTierInput {
  key?: string
  maxPercentile?: number
  position?: number
  label?: string
  icon?: string
  color?: string
}
