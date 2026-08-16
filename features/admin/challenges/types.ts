export interface AdminChallengeDay {
  day_number: number
  prompt: string
  emoji: string | null
}

export interface AdminChallenge {
  id: string
  title: string
  description: string | null
  tag: string
  days: number
  reward_kobo: number
  accent_from: string
  accent_to: string | null
  status: "draft" | "active" | "ended"
  created_at: string
  participant_count: number
  completion_count: number
  day_prompts: AdminChallengeDay[]
}

export interface ListChallengesParams {
  page?: number
  perPage?: number
}

export interface CreateChallengeInput {
  title: string
  description?: string
  tag: string
  rewardKobo: number
  accentFrom: string
  accentTo: string | null
  days: { prompt: string }[]
}

export interface UpdateChallengeInput {
  title?: string
  description?: string
  rewardKobo?: number
  accentFrom?: string
  accentTo?: string | null
  status?: "draft" | "active" | "ended"
  days?: { prompt: string }[]
}
