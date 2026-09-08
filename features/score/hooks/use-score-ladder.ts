"use client"

import { useMyScore } from "./use-my-score"
import { useTiers } from "./use-tiers"

export function useScoreLadder() {
  const standing = useMyScore()
  const tiers = useTiers()

  const score = standing.data?.score ?? 0
  const ladder = [...(tiers.data ?? [])]
    .sort((a, b) => b.min_score - a.min_score)
    .map((tier) => ({
      ...tier,
      reached: tier.min_score <= score,
      current: tier.key === standing.data?.tier?.key,
    }))

  return {
    standing: standing.data ?? null,
    ladder,
    loading: standing.isPending || tiers.isPending,
    error: standing.isError || tiers.isError,
    refetch: () => {
      void standing.refetch()
      void tiers.refetch()
    },
  }
}
