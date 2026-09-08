"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getMatchDetail } from "../api"

export function useMatchDetail(matchId: string | null) {
  return useQuery({
    queryKey: ["football", "match", matchId],
    queryFn: () => getMatchDetail(matchId!),
    enabled: matchId !== null,
    staleTime: 30_000,
    refetchInterval: (query) => {
      const status = query.state.data?.match.status
      return status === "live" || status === "halftime" ? MINUTE_MS : false
    },
  })
}
