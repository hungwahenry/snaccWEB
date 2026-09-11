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

export interface TierInput {
  key: string
  minScore: number
  position: number
  label: string
  icon: string
  color: string
}

export interface TierDraft {
  key: string
  minScore: string
  position: string
  label: string
  icon: string
  color: string
}
