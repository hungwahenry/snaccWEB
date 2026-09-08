"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { searchMessages } from "../api"

export const MIN_QUERY = 2

export function useMessageSearch(q: string) {
  return useQuery({
    queryKey: ["messages", "search", q],
    queryFn: () => searchMessages(q, 1),
    enabled: q.length >= MIN_QUERY,
    staleTime: MINUTE_MS,
  })
}
