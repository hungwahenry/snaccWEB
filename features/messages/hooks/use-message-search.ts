"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { searchMessages } from "../api"
import { MIN_SEARCH } from "../utils/search"
import { messageKeys } from "../utils/keys"

export function useMessageSearch(q: string, conversationId?: string) {
  return useQuery({
    queryKey: messageKeys.search(q, conversationId),
    queryFn: () => searchMessages(q, 1, conversationId),
    enabled: q.length >= MIN_SEARCH,
    staleTime: MINUTE_MS,
  })
}
