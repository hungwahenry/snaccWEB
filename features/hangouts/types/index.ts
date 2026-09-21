import type { Snacc } from "@/features/snaccs/types"
import type { Author } from "@/features/users/types"

export type HangoutState = "upcoming" | "happening" | "over" | "cancelled"

export type JoinState = "none" | "requested" | "going"

export interface SnaccHangout {
  title: string
  emoji: string
  place: string | null
  starts_at: string
  joinable_until: string
  wraps_at: string
  capacity: number
  going_count: number
  full: boolean
  private: boolean
  state: HangoutState
  join_state: JoinState
  requests_count: number | null
  university_id: string
}

export interface HangoutTag {
  snacc_id: string
  title: string
  emoji: string
}

export type HangoutScope = "campus" | "mine"

export interface HangoutCard {
  id: string
  snacc: Snacc
  friends_going: Author[]
  friends_going_count: number
}

export interface HangoutDraft {
  title: string
  emoji: string
  place: string
  startsAt: string | null
  capacity: number
  private: boolean
}

export interface HangoutPayload {
  title: string
  emoji: string
  place: string
  startsAt: string
  capacity: number
  private: boolean
}

export interface HangoutLimits {
  titleMax: number
  placeMax: number
  capacityMin: number
  capacityMax: number
  minLeadMinutes: number
  maxAheadDays: number
}
