"use client"

import { Stat, StatGrid } from "@/components/admin/detail"
import { formatNaira, formatNumber } from "@/lib/format"
import { useWithdrawalSummary } from "../hooks/use-withdrawals"

function waitingSince(oldestAt: string | null): string {
  if (!oldestAt) return "nothing waiting"

  const days = Math.floor(
    (Date.now() - new Date(oldestAt).getTime()) / 86_400_000
  )
  if (days < 1) return "oldest today"

  return `oldest ${days} day${days === 1 ? "" : "s"} ago`
}

export function WithdrawalsSummary() {
  const { data } = useWithdrawalSummary()
  if (!data) return null

  return (
    <StatGrid columns={2}>
      <Stat
        label="Still with Paystack"
        value={formatNaira(data.pending.total)}
        hint={`${formatNumber(data.pending.count)} unsettled · ${waitingSince(data.pending.oldest_at)}`}
      />
      <Stat
        label={`Paid in ${data.paid.days} days`}
        value={formatNaira(data.paid.total)}
        hint={`${formatNumber(data.paid.count)} settled`}
      />
    </StatGrid>
  )
}
