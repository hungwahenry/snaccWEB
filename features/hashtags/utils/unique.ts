import type { Hashtag } from "../types"

/** Tags have no id, so the repeats a shifting list leaves between pages are dropped by tag. */
export function uniqueHashtags<T extends Hashtag>(hashtags: T[]): T[] {
  const seen = new Set<string>()
  return hashtags.filter((hashtag) => {
    if (seen.has(hashtag.tag)) return false
    seen.add(hashtag.tag)
    return true
  })
}
