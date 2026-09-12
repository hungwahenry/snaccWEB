import { Stat, StatGrid } from "@/features/admin/shell/components/detail"
import { StatSkeleton } from "@/features/admin/shell/components/stat-skeleton"
import { humanize } from "@/features/admin/shell/utils/format"
import { formatNaira } from "@/lib/format"
import type { WalletSummary } from "../types"
import { holdersNote, poolNote } from "../utils/wallet"

const PLACEHOLDERS = [0, 1, 2]

export function WalletsSummary({
  summary,
  pending,
}: {
  summary: WalletSummary | undefined
  pending: boolean
}) {
  if (pending) {
    return (
      <StatGrid columns={3}>
        {PLACEHOLDERS.map((card) => (
          <StatSkeleton key={card} />
        ))}
      </StatGrid>
    )
  }
  if (!summary) return null

  return (
    <StatGrid columns={3}>
      <Stat
        label="Held by users"
        value={formatNaira(summary.users.balance)}
        hint={holdersNote(summary.users)}
      />
      {summary.system.map((pool) => (
        <Stat
          key={pool.slug}
          label={humanize(pool.slug)}
          value={formatNaira(pool.balance)}
          hint={poolNote(pool.slug)}
        />
      ))}
    </StatGrid>
  )
}
