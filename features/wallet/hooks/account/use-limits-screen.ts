"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { railLines, tierCopy } from "../../utils/limits"
import { useLimits } from "./use-limits"

export function useLimitsScreen() {
  const limits = useLimits()
  const accountNumberEnabled = useFlag("wallet_dva")
  const data = limits.data

  return {
    failed: limits.isError && !data,
    retry: () => void limits.refetch(),
    tier: data ? tierCopy(data.tier, accountNumberEnabled) : null,
    rails: data ? railLines(data) : [],
  }
}

export type LimitsScreenProps = ReturnType<typeof useLimitsScreen>
