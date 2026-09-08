"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { suggestUsers } from "../api"

export function useUserSuggestions(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ["users", "suggest", query],
    queryFn: () => suggestUsers(query),
    enabled: enabled && query.length > 0,
    placeholderData: keepPreviousData,
  })
}
