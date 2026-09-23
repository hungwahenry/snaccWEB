import type { FeedSnaccEvent, NewPoster } from "../types"

export const POSTERS_SHOWN = 3

/** Adds whoever just posted to the faces on the new-snaccs pill, once each, newest kept. */
export function withNewPoster(
  current: NewPoster[],
  event: FeedSnaccEvent
): NewPoster[] {
  const key = event.actor_id
  if (!key || current.some((poster) => poster.key === key)) return current

  const poster: NewPoster = { key, avatarUrl: event.avatar_url ?? null }
  return [...current, poster].slice(-POSTERS_SHOWN)
}
