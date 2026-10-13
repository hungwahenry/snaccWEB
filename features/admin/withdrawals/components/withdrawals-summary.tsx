import { Stat, StatGrid } from "@/features/admin/shell/components/detail"
import { plural } from "@/features/admin/shell/utils/format"
import { formatTotals } from "@/lib/money"
import type { WithdrawalSummary } from "../types"
import { waitingNote } from "../utils/withdrawals"

export function WithdrawalsSummary({
  summary,
}: {
  summary: WithdrawalSummary | undefined
}) {
  if (!summary) return null

  return (
    <StatGrid columns={2}>
      <Stat
        label="Still with Paystack"
        value={formatTotals(summary.pending.totals)}
        hint={waitingNote(summary.pending)}
      />
      <Stat
        label={`Paid in the last ${plural(summary.paid.days, "day")}`}
        value={formatTotals(summary.paid.totals)}
        hint={`${plural(summary.paid.count, "withdrawal")} settled`}
      />
    </StatGrid>
  )
}
