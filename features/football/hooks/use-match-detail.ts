"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getMatchDetail } from "../api"
import { footballKeys } from "../utils/keys"

export function useMatchDetail(matchId: string | null) {
  return useQuery({
    queryKey: footballKeys.match(matchId ?? ""),
    queryFn: () => getMatchDetail(matchId!),
    enabled: matchId !== null,
    staleTime: 30_000,
    refetchInterval: (query) => {
      const status = query.state.data?.match.status
      return status === "live" || status === "halftime" ? MINUTE_MS : false
    },
  })
}
