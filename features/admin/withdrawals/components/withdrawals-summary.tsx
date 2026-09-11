import { Stat, StatGrid } from "@/features/admin/shell/components/detail"
import { plural } from "@/features/admin/shell/utils/format"
import { formatNaira } from "@/lib/format"
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
        value={formatNaira(summary.pending.total)}
        hint={waitingNote(summary.pending)}
      />
      <Stat
        label={`Paid in the last ${plural(summary.paid.days, "day")}`}
        value={formatNaira(summary.paid.total)}
        hint={`${plural(summary.paid.count, "withdrawal")} settled`}
      />
    </StatGrid>
  )
}
