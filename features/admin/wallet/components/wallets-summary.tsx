import { Stat, StatGrid } from "@/features/admin/shell/components/detail"
import { StatSkeleton } from "@/features/admin/shell/components/stat-skeleton"
import { humanize } from "@/features/admin/shell/utils/format"
import { formatMoney } from "@/lib/money"
import type { WalletSummary } from "../types"
import { holdersNote, poolNote } from "../utils/wallet"

const PLACEHOLDERS = [0, 1, 2]

export function WalletsSummary({
  summary,
  pending,
}: {
  summary: WalletSummary[] | undefined
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
  const several = summary.length > 1

  return (
    <div className="flex flex-col gap-6">
      {summary.map((section) => (
        <div key={section.currency} className="flex flex-col gap-3">
          {several ? (
            <h3 className="text-lg font-bold">{section.currency}</h3>
          ) : null}
          <StatGrid columns={3}>
            <Stat
              label="Held by users"
              value={formatMoney(section.users.balance)}
              hint={holdersNote(section.users)}
            />
            {section.system.map((pool) => (
              <Stat
                key={pool.slug}
                label={humanize(pool.slug)}
                value={formatMoney(pool.balance)}
                hint={poolNote(pool.slug)}
              />
            ))}
          </StatGrid>
        </div>
      ))}
    </div>
  )
}
