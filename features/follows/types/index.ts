import type { Author } from "@/features/users/types"

export type FollowTab = "followers" | "following"

/** Someone in a list of people, with where you and they stand. */
export interface FollowUser extends Author {
  is_following: boolean
  follows_you: boolean
}
