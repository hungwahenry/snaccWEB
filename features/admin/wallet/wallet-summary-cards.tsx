"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNaira, formatNumber } from "@/lib/format"
import { useWalletSummary } from "./use-wallet"

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="flex flex-col gap-1 pt-6">
          <CardDescription>Held by users</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {formatNaira(query.data.users.balance)}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {formatNumber(query.data.users.accounts)} wallets ·{" "}
            {formatNumber(query.data.users.frozen)} frozen
          </p>
        </CardContent>
      </Card>
      {query.data.system.map((pool) => (
        <Card key={pool.slug}>
          <CardContent className="flex flex-col gap-1 pt-6">
            <CardDescription className="capitalize">
              {pool.slug}
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatNaira(pool.balance)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {POOLS[pool.slug] ?? "System pool"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
