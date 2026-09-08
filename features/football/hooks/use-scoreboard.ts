"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { MINUTE_MS } from "@/lib/duration"
import { getScoreboard } from "../api"

export function useScoreboard() {
  const enabled = useFlag("live_scores")

  return useQuery({
    queryKey: ["football", "scoreboard"],
    queryFn: getScoreboard,
    enabled,
    staleTime: 30_000,
    refetchInterval: MINUTE_MS,
  })
}
