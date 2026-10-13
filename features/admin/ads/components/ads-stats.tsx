import { Stat, StatGrid } from "@/features/admin/shell/components/detail"
import { StatSkeleton } from "@/features/admin/shell/components/stat-skeleton"
import { formatTotals } from "@/lib/money"
import type { AdStats } from "../types"

export function AdsStats({
  stats,
  pending,
}: {
  stats: AdStats | undefined
  pending: boolean
}) {
  if (pending) {
    return (
      <StatGrid columns={2}>
        <StatSkeleton />
        <StatSkeleton />
      </StatGrid>
    )
  }
  if (!stats) return null

  return (
    <StatGrid columns={2}>
      <Stat
        label="Held for promotions"
        value={formatTotals(stats.held)}
        hint="Budgets paid in and not settled yet"
      />
      <Stat
        label="Earned from promotions"
        value={formatTotals(stats.earned)}
        hint="Spent on promotions that have settled"
      />
    </StatGrid>
  )
}
