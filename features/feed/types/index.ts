export type FeedScope = "campus" | "country" | "following"

/** Which of the optional feeds are switched on. Campus is always there. */
export interface FeedScopesEnabled {
  following: boolean
  country: boolean
}

/** A face on the new-snaccs pill. */
export interface NewPoster {
  key: string
  avatarUrl: string | null
}

/** The `feed.snacc` socket event: someone just posted to a feed you are watching. */
export interface FeedSnaccEvent {
  snacc_id?: string
  actor_id?: string
  avatar_url?: string | null
}
