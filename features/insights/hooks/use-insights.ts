"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { useIsPremium } from "@/features/premium/hooks/use-premium-limit"
import { getInsights, getSnaccInsight } from "../api"

export function useInsights(days: number) {
  const premium = useIsPremium()

  return useQuery({
    queryKey: ["insights", days],
    queryFn: () => getInsights(days),
    staleTime: 5 * MINUTE_MS,
    enabled: premium,
  })
}

export function useSnaccInsight(id: string | null) {
  const premium = useIsPremium()

  return useQuery({
    queryKey: ["insights", "snacc", id],
    queryFn: () => getSnaccInsight(id as string),
    staleTime: 5 * MINUTE_MS,
    enabled: premium && id !== null,
  })
}
