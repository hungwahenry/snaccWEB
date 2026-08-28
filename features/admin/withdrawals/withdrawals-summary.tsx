"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatNaira, formatNumber } from "@/lib/format"
import { useWithdrawalSummary } from "./use-withdrawals"

function waitingSince(oldestAt: string | null): string {
  if (!oldestAt) return "nothing waiting"

  const days = Math.floor(
    (Date.now() - new Date(oldestAt).getTime()) / 86_400_000
  )
  if (days < 1) return "oldest today"

  return `oldest ${days} day${days === 1 ? "" : "s"} ago`
}

function Tile({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {hint}
      </CardContent>
    </Card>
  )
}

export function WithdrawalsSummary() {
  const { data } = useWithdrawalSummary()
  if (!data) return null

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Tile
        label="Waiting to be claimed"
        value={formatNaira(data.pending.total)}
        hint={`${formatNumber(data.pending.count)} waiting · ${waitingSince(data.pending.oldest_at)}`}
      />
      <Tile
        label="Being paid out"
        value={formatNaira(data.processing.total)}
        hint={`${formatNumber(data.processing.count)} claimed by an admin`}
      />
      <Tile
        label={`Paid in ${data.paid.days} days`}
        value={formatNaira(data.paid.total)}
        hint={`${formatNumber(data.paid.count)} settled`}
      />
    </div>
  )
}
