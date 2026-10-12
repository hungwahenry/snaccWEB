import { Stat, StatGrid } from "@/features/admin/shell/components/detail"
import { StatSkeleton } from "@/features/admin/shell/components/stat-skeleton"
import { formatNaira } from "@/lib/format"
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
        value={formatNaira(stats.held_kobo)}
        hint="Budgets paid in and not settled yet"
      />
      <Stat
        label="Earned from promotions"
        value={formatNaira(stats.earned_kobo)}
        hint="Spent on promotions that have settled"
      />
    </StatGrid>
  )
}
