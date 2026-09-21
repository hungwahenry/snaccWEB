"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import type { FlagKey } from "@/features/config/types"
import { getPremium } from "../api"
import { PREMIUM_KEY } from "../utils/keys"

export function usePremium() {
  const enabled = useFlag("premium")

  return useQuery({ queryKey: PREMIUM_KEY, queryFn: getPremium, enabled })
}

export function usePremiumFeature(key: FlagKey): boolean {
  const offered = useFlag("premium")
  return useFlag(key) && offered
}
