"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { MINUTE_MS } from "@/lib/duration"
import { getScoreboard } from "../api"
import { footballKeys } from "../utils/keys"

export function useScoreboard() {
  const enabled = useFlag("live_scores")

  return useQuery({
    queryKey: footballKeys.scoreboard(),
    queryFn: getScoreboard,
    enabled,
    staleTime: 30_000,
    refetchInterval: MINUTE_MS,
  })
}
