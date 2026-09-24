"use client"

import { useMemo, useState } from "react"
import { useCashtagSuggestions } from "@/features/cashtags/hooks/use-cashtag-suggestions"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useHashtagSuggestions } from "@/features/hashtags/hooks/use-hashtag-suggestions"
import { useUserSuggestions } from "@/features/users/hooks/use-user-suggestions"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { TypeaheadSuggestion } from "../../types"
import { activeToken } from "../../utils/entities"
import {
  cashtagSuggestion,
  hashtagSuggestion,
  stepHighlight,
  userSuggestion,
} from "../../utils/typeahead"

const SEPARATOR = " "
const SETTLE_MS = 200

export function useComposerTypeahead(body: string, cursor: number) {
  const cashtagsOn = useFlag("cashtags")
  const found = activeToken(body, cursor)
  const token = found?.kind === "cashtag" && !cashtagsOn ? null : found

  const signature = token ? `${token.kind}${SEPARATOR}${token.term}` : ""
  const settled = useDebouncedValue(signature, SETTLE_MS)
  const catchingUp = signature !== settled
  const [kind, term = ""] = settled.split(SEPARATOR)

  const hashtags = useHashtagSuggestions(term, kind === "hashtag")
  const users = useUserSuggestions(term, kind === "mention")
  const coins = useCashtagSuggestions(term, kind === "cashtag")

  const suggestions = useMemo<TypeaheadSuggestion[]>(() => {
    if (catchingUp) return []
    if (kind === "hashtag") return (hashtags.data ?? []).map(hashtagSuggestion)
    if (kind === "mention")
      return (users.data ?? []).flatMap((user) => userSuggestion(user) ?? [])
    if (kind === "cashtag") return (coins.data ?? []).map(cashtagSuggestion)
    return []
  }, [catchingUp, kind, hashtags.data, users.data, coins.data])

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
      (kind === "mention" && users.isFetching) ||
      (kind === "cashtag" && coins.isFetching),
    move: (direction: 1 | -1) =>
      setHighlight({
        signature,
        index: stepHighlight(highlighted, suggestions.length, direction),
      }),
  }
}
