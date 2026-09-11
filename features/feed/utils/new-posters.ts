import type { FeedSnaccEvent, NewPoster } from "../types"

export const POSTERS_SHOWN = 3

const GHOST_KEY = "ghost"

/** Adds whoever just posted to the faces on the new-snaccs pill, once each, newest kept. */
export function withNewPoster(
  current: NewPoster[],
  event: FeedSnaccEvent
): NewPoster[] {
  const anonymous = event.anonymous === true
  const key = anonymous ? GHOST_KEY : event.actor_id
  if (!key || current.some((poster) => poster.key === key)) return current

  const poster: NewPoster = {
    key,
    avatarUrl: anonymous ? null : (event.avatar_url ?? null),
    anonymous,
  }
  return [...current, poster].slice(-POSTERS_SHOWN)
}
