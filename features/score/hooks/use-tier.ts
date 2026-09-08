"use client"

import { useTierLookup } from "@/providers/tiers-provider"
import type { ScoreTier } from "@/features/score/types"

export function useTier(key: string | null | undefined): ScoreTier | null {
  return useTierLookup()(key)
}
