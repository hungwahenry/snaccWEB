"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { suggestCashtags } from "../api"
import { cashtagKeys } from "../utils/keys"

export function useCashtagSuggestions(query: string, enabled: boolean) {
  return useQuery({
    queryKey: cashtagKeys.suggestions(query),
    queryFn: () => suggestCashtags(query),
    enabled: enabled && query.length > 0,
    placeholderData: keepPreviousData,
  })
}
