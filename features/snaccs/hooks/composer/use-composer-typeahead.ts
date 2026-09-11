"use client"

import { useMemo, useState } from "react"
import { useHashtagSuggestions } from "@/features/hashtags/hooks/use-hashtag-suggestions"
import { useUserSuggestions } from "@/features/users/hooks/use-user-suggestions"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { TypeaheadSuggestion } from "../../types"
import { activeToken } from "../../utils/entities"
import {
  hashtagSuggestion,
  stepHighlight,
  userSuggestion,
} from "../../utils/typeahead"

const SEPARATOR = " "
const SETTLE_MS = 200

/** Hashtags and people to finish the word under the cursor, with a row the keys can move. */
export function useComposerTypeahead(body: string, cursor: number) {
  const token = activeToken(body, cursor)

  const signature = token ? `${token.kind}${SEPARATOR}${token.term}` : ""
  const settled = useDebouncedValue(signature, SETTLE_MS)
  const catchingUp = signature !== settled
  const [kind, term = ""] = settled.split(SEPARATOR)

  const hashtags = useHashtagSuggestions(term, kind === "hashtag")
  const users = useUserSuggestions(term, kind === "mention")

  const suggestions = useMemo<TypeaheadSuggestion[]>(() => {
    if (catchingUp) return []
    if (kind === "hashtag") return (hashtags.data ?? []).map(hashtagSuggestion)
    if (kind === "mention")
      return (users.data ?? []).flatMap((user) => userSuggestion(user) ?? [])
    return []
  }, [catchingUp, kind, hashtags.data, users.data])

  const [highlight, setHighlight] = useState({ signature, index: 0 })
  const highlighted = highlight.signature === signature ? highlight.index : 0

  return {
    token,
    suggestions,
    highlighted,
    open: (token?.term.length ?? 0) > 0,
    loading:
      catchingUp ||
      (kind === "hashtag" && hashtags.isFetching) ||
      (kind === "mention" && users.isFetching),
    move: (direction: 1 | -1) =>
      setHighlight({
        signature,
        index: stepHighlight(highlighted, suggestions.length, direction),
      }),
  }
}
