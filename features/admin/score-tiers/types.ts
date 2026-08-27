export interface AdminTier {
  id: string
  key: string
  min_score: number
  position: number
  label: string
  icon: string
  color: string
  created_at: string
}

export interface CreateTierInput {
  key: string
  minScore: number
  position: number
  label?: string
  icon?: string
  color?: string
}

export interface UpdateTierInput {
  key?: string
  minScore?: number
  position?: number
  label?: string
  icon?: string
  color?: string
}
