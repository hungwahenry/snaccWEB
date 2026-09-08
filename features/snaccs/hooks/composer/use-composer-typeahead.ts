"use client"

import { useHashtagSuggestions } from "@/features/hashtags/hooks/use-hashtag-suggestions"
import type { HashtagSuggestion } from "@/features/hashtags/types"
import { useUserSuggestions } from "@/features/users/hooks/use-user-suggestions"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { activeToken } from "../../utils/entities"

export interface TypeaheadSuggestion {
  key: string
  label: string
  hint: string | null
  avatarUrl: string | null
  replacement: string
}

const SEPARATOR = " "

export function useComposerTypeahead(body: string, cursor: number) {
  const token = activeToken(body, cursor)

  const signature = token ? `${token.kind}${SEPARATOR}${token.term}` : ""
  const settled = useDebouncedValue(signature, 200)
  const catchingUp = signature !== settled
  const [kind, term] = settled.split(SEPARATOR)

  const hashtags = useHashtagSuggestions(term ?? "", kind === "hashtag")
  const users = useUserSuggestions(term ?? "", kind === "mention")

  const suggestions: TypeaheadSuggestion[] =
    kind === "hashtag"
      ? (hashtags.data ?? []).map((hashtag) => ({
          key: hashtag.tag,
          label: `#${hashtag.tag}`,
          hint: usageHint(hashtag),
          avatarUrl: null,
          replacement: `#${hashtag.tag} `,
        }))
      : kind === "mention"
        ? (users.data ?? []).map((user) => ({
            key: user.id,
            label: `@${user.username}`,
            hint: user.display_name,
            avatarUrl: user.avatar_url,
            replacement: `@${user.username} `,
          }))
        : []

  return {
    token,
    suggestions: catchingUp ? [] : suggestions,
    open: (token?.term.length ?? 0) > 0,
    loading:
      catchingUp ||
      (kind === "hashtag"
        ? hashtags.isFetching
        : kind === "mention"
          ? users.isFetching
          : false),
  }
}

function usageHint(hashtag: HashtagSuggestion): string {
  return hashtag.campus_usage_count > 0
    ? `${hashtag.campus_usage_count} on campus`
    : `${hashtag.usage_count} total`
}
