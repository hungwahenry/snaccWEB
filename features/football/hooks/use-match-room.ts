"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { MINUTE_MS } from "@/lib/duration"
import { getMatchSnaccCounts, getMatchSnaccs } from "../api"
import { footballKeys } from "../utils/keys"

export function useMatchRoom(matchId: string) {
  return useInfiniteList(snaccKeys.match(matchId), (page) =>
    getMatchSnaccs(matchId, page)
  )
}

/** Counts for the whole board in one request, so the strip doesn't ask per fixture. */
export function useMatchSnaccCounts() {
  const enabled = useFlag("snacc_matches")

  return useQuery({
    queryKey: footballKeys.snaccCounts(),
    queryFn: getMatchSnaccCounts,
    staleTime: MINUTE_MS,
    enabled,
  })
}
