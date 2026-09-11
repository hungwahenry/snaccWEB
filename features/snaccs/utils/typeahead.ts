import type { HashtagSuggestion } from "@/features/hashtags/types"
import type { UserSuggestion } from "@/features/users/types"
import { compactCount } from "@/lib/format"
import type { TypeaheadSuggestion } from "../types"

export function hashtagSuggestion(
  hashtag: HashtagSuggestion
): TypeaheadSuggestion {
  return {
    key: `#${hashtag.tag}`,
    label: `#${hashtag.tag}`,
    hint:
      hashtag.campus_usage_count > 0
        ? `${compactCount(hashtag.campus_usage_count)} on campus`
        : `${compactCount(hashtag.usage_count)} total`,
    avatarUrl: null,
    replacement: `#${hashtag.tag} `,
  }
}

export function userSuggestion(
  user: UserSuggestion
): TypeaheadSuggestion | null {
  if (!user.username) return null
  return {
    key: user.id,
    label: `@${user.username}`,
    hint: user.display_name,
    avatarUrl: user.avatar_url,
    replacement: `@${user.username} `,
  }
}

/** Moves the highlighted row with the arrow keys, wrapping round at either end. */
export function stepHighlight(
  current: number,
  count: number,
  direction: 1 | -1
): number {
  if (count === 0) return 0
  return (current + direction + count) % count
}
