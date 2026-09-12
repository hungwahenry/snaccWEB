"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { formatNaira } from "@/lib/format"
import { useClaimEarnings } from "./use-claim-earnings"
import { useCampusFund, useEarningsBalance, useTopSnaccs } from "./use-earnings"

const TOP_SHOWN = 3

export function useEarningsHome() {
  const walletEnabled = useFlag("wallet")
  const balance = useEarningsBalance()
  const fund = useCampusFund()
  const topSnaccs = useTopSnaccs()
  const claim = useClaimEarnings()

  const data = balance.data
  const claimable =
    walletEnabled && data !== undefined && data.eligible && data.balance > 0

  return {
    loading: balance.isLoading || fund.isLoading || topSnaccs.isLoading,
    retry: () => void balance.refetch(),
    summary: data
      ? {
          balance: formatNaira(data.balance),
          milestones: data.milestones,
          claim: claimable
            ? {
                label: `Claim ${formatNaira(data.balance)}`,
                busy: claim.isPending,
                onClaim: () => {
                  if (!claim.isPending) claim.mutate()
                },
              }
            : null,
        }
      : null,
    fund: fund.data ?? null,
    topSnaccs: (topSnaccs.data ?? []).slice(0, TOP_SHOWN),
  }
}

export type EarningsHomeProps = ReturnType<typeof useEarningsHome>
