import type { Author } from "@/features/users/types"
import type { Money } from "@/lib/money"

export type InviteeStatus = "pending" | "paid" | "closed"

export interface ReferralReward {
  referrer: Money
  referee: Money
  score: number
}

export interface ReferralStats {
  invited: number
  paid: number
  earned: Money
}

export interface ReferralOverview {
  code: string
  link: string
  reward: ReferralReward
  can_claim: boolean
  claim_window_days: number
  qualify_days: number
  referred_by: Author | null
  stats: ReferralStats
}

export interface Invitee {
  id: string
  user: Author
  status: InviteeStatus
  created_at: string
  paid_at: string | null
}
