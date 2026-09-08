"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { suggestHashtags } from "../api"

export function useHashtagSuggestions(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ["hashtags", "suggest", query],
    queryFn: () => suggestHashtags(query),
    enabled: enabled && query.length > 0,
    placeholderData: keepPreviousData,
  })
}
