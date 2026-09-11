"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { suggestHashtags } from "../api"
import { hashtagKeys } from "../utils/keys"

export function useHashtagSuggestions(query: string, enabled: boolean) {
  return useQuery({
    queryKey: hashtagKeys.suggestions(query),
    queryFn: () => suggestHashtags(query),
    enabled: enabled && query.length > 0,
    placeholderData: keepPreviousData,
  })
}
