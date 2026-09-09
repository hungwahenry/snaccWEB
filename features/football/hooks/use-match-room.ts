"use client"

import { getMatchSnaccCounts, getMatchSnaccs } from "../api"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { useFlag } from "@/features/config/hooks/use-flag"

export function useMatchRoom(matchId: string) {
  return useInfiniteList(["match-room", matchId], (page) =>
    getMatchSnaccs(matchId, page)
  )
}

/** Counts for the whole board in one request, so the strip doesn't ask per fixture. */
export function useMatchSnaccCounts() {
  const enabled = useFlag("snacc_matches")

  return useQuery({
    queryKey: ["match-snacc-counts"],
    queryFn: getMatchSnaccCounts,
    staleTime: MINUTE_MS,
    enabled,
  })
}
