"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { searchGifs, trendingGifs } from "../api"

export function useGifSearch(query: string) {
  const term = query.trim()
  return useQuery({
    queryKey: ["giphy", "search", term],
    queryFn: () => searchGifs(term),
    enabled: term.length > 0,
    placeholderData: keepPreviousData,
  })
}

export function useGifTrending(enabled: boolean) {
  return useQuery({
    queryKey: ["giphy", "trending"],
    queryFn: () => trendingGifs(),
    enabled,
    staleTime: 5 * MINUTE_MS,
  })
}
