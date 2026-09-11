"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { suggestUsers } from "../api"
import { userKeys } from "../utils/keys"

export function useUserSuggestions(query: string, enabled: boolean) {
  return useQuery({
    queryKey: userKeys.suggestions(query),
    queryFn: () => suggestUsers(query),
    enabled: enabled && query.length > 0,
    placeholderData: keepPreviousData,
  })
}
