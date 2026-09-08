"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { searchStickers, trendingStickers } from "../api"

export function useStickerSearch(query: string, enabled: boolean) {
  const term = query.trim()
  return useQuery({
    queryKey: ["giphy", "stickers", "search", term],
    queryFn: () => searchStickers({ query: term }),
    enabled: enabled && term.length > 0,
    placeholderData: keepPreviousData,
  })
}

export function useStickerTrending(enabled: boolean) {
  return useQuery({
    queryKey: ["giphy", "stickers", "trending"],
    queryFn: () => trendingStickers(),
    enabled,
    staleTime: 5 * MINUTE_MS,
  })
}
