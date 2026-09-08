"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useTiers } from "@/features/score/hooks/use-tiers"
import type { ScoreTier } from "@/features/score/types"

type TierLookup = (key: string | null | undefined) => ScoreTier | null

const TiersContext = createContext<TierLookup>(() => null)

/// Tier flair is design data (label, icon, colour) fetched once and read anywhere a name renders,
/// the way a theme is. Presentational components read it through context instead of fetching.
export function TiersProvider({ children }: { children: ReactNode }) {
  const tiers = useTiers().data

  const lookup = useMemo<TierLookup>(() => {
    const byKey = new Map((tiers ?? []).map((tier) => [tier.key, tier]))
    return (key) => (key ? (byKey.get(key) ?? null) : null)
  }, [tiers])

  return (
    <TiersContext.Provider value={lookup}>{children}</TiersContext.Provider>
  )
}

export function useTierLookup(): TierLookup {
  return useContext(TiersContext)
}
