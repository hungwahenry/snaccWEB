"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getPopularHashtags } from "../api"
import { hashtagKeys } from "../utils/keys"

export function usePopularHashtags() {
  return useQuery({
    queryKey: hashtagKeys.popular(),
    queryFn: getPopularHashtags,
    staleTime: 5 * MINUTE_MS,
  })
}
