"use client"

import { useQuery } from "@tanstack/react-query"
import { ME_KEY } from "@/lib/query-keys"
import { MINUTE_MS } from "@/lib/duration"
import { fetchMe } from "@/features/auth/api"

export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * MINUTE_MS,
  })
}
