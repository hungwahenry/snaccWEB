"use client"

import { Stat, StatGrid } from "@/components/admin/detail"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNaira, formatNumber } from "@/lib/format"
import { useWalletSummary } from "../hooks/use-wallet"

const POOLS: Record<string, string> = {
  earnings: "Owed as unclaimed earnings",
  payouts: "On its way to banks",
  deposits: "Paid in from banks",
  fees: "Kept as fees",
  adjustments: "Moved by hand",
}

export function WalletSummaryCards() {
  const query = useWalletSummary()

  if (query.isPending) return <Skeleton className="h-28 w-full" />
  if (!query.data) return null

  return (
    <StatGrid columns={3}>
      <Stat
        label="Held by users"
        value={formatNaira(query.data.users.balance)}
        hint={`${formatNumber(query.data.users.accounts)} wallets · ${formatNumber(query.data.users.frozen)} frozen`}
      />
      {query.data.system.map((pool) => (
        <Stat
          key={pool.slug}
          label={<span className="capitalize">{pool.slug}</span>}
          value={formatNaira(pool.balance)}
          hint={POOLS[pool.slug] ?? "System pool"}
        />
      ))}
    </StatGrid>
  )
}
