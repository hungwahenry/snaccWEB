import type { FollowState } from "@/features/follows/types"
import type { UserScore } from "@/features/score/types"
import type { University, UniversityBadge } from "@/features/universities/types"
import type { AdminPermissions } from "@/lib/permissions"

export type MoneyRequestPrivacy = "everyone" | "following" | "nobody"

export type Gender = "male" | "female" | "non_binary" | "prefer_not_to_say"

export interface Birthday {
  day: number
  month: number
}

export interface Profile {
  username: string | null
  display_name: string | null
  avatar_url: string
  cover_url: string | null
  bio: string | null
  graduation_year: number | null
  graduated: boolean
  major: string | null
  gender: Gender | null
  birthday: Birthday | null
  celebrate_birthday: boolean
  is_birthday: boolean
  snaccs_count: number
  followers_count: number
  following_count: number
  balance: number
  allow_anonymous_messages: boolean
  money_requests_from: MoneyRequestPrivacy
  avatar_options: Record<string, string | number> | null
  completed_at: string | null
  official: boolean
  premium: boolean
  is_private: boolean
  university: University | null
  university_locked: boolean
}

/** The signed-in account, as GET /auth/me and every profile edit return it. */
export interface User {
  id: string
  email: string
  role: "user" | "admin"
  permissions: AdminPermissions
  email_verified_at: string | null
  created_at: string
  profile: Profile | null
}

/** Someone as they appear next to what they posted. */
export interface Author {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: UniversityBadge | null
  score: UserScore
  official: boolean
  premium: boolean
  is_birthday: boolean
}

export type UserSuggestion = Author

export interface UsernameAvailability {
  username: string
  available: boolean
}

export type ProfileTab = "snaccs" | "replies" | "media" | "resnaccs"

export interface MomentRing {
  total: number
  unseen: number
}

export interface PublicProfile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  cover_url: string | null
  bio: string | null
  major: string | null
  graduation_year: number | null
  graduated: boolean
  university: University | null
  snaccs_count: number
  followers_count: number
  following_count: number
  total_views_received: number
  is_following: boolean
  notifying: boolean
  follows_you: boolean
  follow_state: FollowState
  is_private: boolean
  /** Public, yours, or you follow them: otherwise their snaccs and lists stay hidden. */
  can_view: boolean
  accepts_anonymous_messages: boolean
  score: UserScore & { points: number }
  official: boolean
  premium: boolean
  birthday: Birthday | null
  is_birthday: boolean
  moments: MomentRing | null
}
