"use client"

import { WalletIcon } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { LoadFailed } from "@/components/ui/load-failed"
import { formatNaira } from "@/lib/format"
import { useCampusFund, useEarningsWallet } from "../hooks/use-earnings"
import { EarningsSkeleton } from "./earnings-skeleton"
import { FundBar } from "./fund-bar"
import { MilestoneList } from "./milestone-list"

/// Earnings on their own, for when the wallet is switched off.
export function EarningsHome() {
  const wallet = useEarningsWallet()
  const fund = useCampusFund()

  if (wallet.isLoading || fund.isLoading) return <EarningsSkeleton />
  if (wallet.isError || !wallet.data) {
    return (
      <div className="py-24">
        <LoadFailed
          title="Could not load your earnings"
          onRetry={() => void wallet.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-7 px-6 py-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <WalletIcon className="size-4 text-muted-foreground" />
          <Eyebrow>Available balance</Eyebrow>
        </div>
        <p className="truncate text-center text-6xl font-extrabold text-foreground tabular-nums">
          {formatNaira(wallet.data.balance)}
        </p>
        <p className="text-sm text-muted-foreground">
          Earned from reactions and resnaccs on your snaccs.
        </p>
      </div>
      <MilestoneList milestones={wallet.data.milestones} />
      {fund.data ? <FundBar fund={fund.data} /> : null}
    </div>
  )
}
