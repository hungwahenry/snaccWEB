import type { LucideIcon } from "lucide-react"

export type FeedScope = "campus" | "global" | "following"
export type FeedSort = "top" | "latest"

export interface FeedSortOption {
  value: FeedSort
  label: string
  hint: string
  icon: LucideIcon
}

/** Which of the optional feeds are switched on. Campus is always there. */
export interface FeedScopesEnabled {
  following: boolean
  global: boolean
}

/** A face on the new-snaccs pill. */
export interface NewPoster {
  key: string
  avatarUrl: string | null
  anonymous: boolean
}

/** The `feed.snacc` socket event: someone just posted to a feed you are watching. */
export interface FeedSnaccEvent {
  snacc_id?: string
  anonymous?: boolean
  actor_id?: string
  avatar_url?: string | null
}
