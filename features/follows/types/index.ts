import type { Author } from "@/features/users/types"

export type FollowTab = "followers" | "following"

/** Following, asked and waiting on a private account, or neither. */
export type FollowState = "none" | "requested" | "following"

/** Someone in a list of people, with where you and they stand. */
export interface FollowUser extends Author {
  is_following: boolean
  follows_you: boolean
  follow_state: FollowState
  is_private: boolean
}
