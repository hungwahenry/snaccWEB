"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { MINUTE_MS } from "@/lib/duration"
import { getTiers } from "../api"

export const TIERS_KEY = ["score", "tiers"]

export function useTiers() {
  const enabled = useFlag("score")
  return useQuery({
    queryKey: TIERS_KEY,
    queryFn: getTiers,
    staleTime: 10 * MINUTE_MS,
    enabled,
  })
}
