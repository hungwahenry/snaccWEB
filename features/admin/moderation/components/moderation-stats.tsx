import { Stat, StatGrid } from "@/features/admin/shell/components/detail"
import { formatNumber } from "@/lib/format"
import type { ModerationTotals } from "../types"

export function ModerationStats({ totals }: { totals: ModerationTotals }) {
  return (
    <StatGrid columns={4}>
      <Stat label="Reviewed" value={formatNumber(totals.reviewed)} />
      <Stat label="Today" value={formatNumber(totals.today)} />
      <Stat
        label="Would act"
        value={formatNumber(totals.acted)}
        hint="verdicts above allow"
      />
      <Stat
        label="Surfaces on"
        value={`${totals.live} of ${totals.surfaces}`}
        hint={
          totals.failures
            ? `${formatNumber(totals.failures)} reviews failed`
            : undefined
        }
      />
    </StatGrid>
  )
}
