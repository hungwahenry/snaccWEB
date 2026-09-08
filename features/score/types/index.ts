export interface ScoreTier {
  key: string
  min_score: number
  position: number
  label: string
  icon: string
  color: string
}

export interface ScoreStanding {
  score: number
  tier: ScoreTier | null
  next: ScoreTier | null
  progress: number
}

export interface UserScore {
  tier: string | null
  og: boolean
}
