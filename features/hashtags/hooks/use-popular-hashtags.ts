"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getPopularHashtags } from "../api"

export function usePopularHashtags() {
  return useQuery({
    queryKey: ["hashtags", "popular"],
    queryFn: getPopularHashtags,
    staleTime: 5 * MINUTE_MS,
  })
}
