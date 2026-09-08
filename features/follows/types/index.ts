import type { UserScore } from "@/features/score/types"

export type FollowTab = "followers" | "following"

export interface FollowUser {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: { id: string; name: string; acronym: string } | null
  score: UserScore
  official: boolean
  is_birthday: boolean
  is_following: boolean
  follows_you: boolean
}
