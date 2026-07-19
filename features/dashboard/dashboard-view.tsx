import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNaira, formatNumber } from "@/lib/format"
import type { DashboardMetrics } from "./index"

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint ? <CardContent className="text-muted-foreground text-xs">{hint}</CardContent> : null}
    </Card>
  )
}

export function DashboardView({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        label="Users"
        value={formatNumber(metrics.users.total)}
        hint={`${metrics.users.verified} verified · ${metrics.users.suspended} suspended`}
      />
      <Stat
        label="Snaccs"
        value={formatNumber(metrics.content.snaccs)}
        hint={`${metrics.content.deleted_snaccs} deleted`}
      />
      <Stat label="Open reports" value={formatNumber(metrics.moderation.open_reports)} />
      <Stat label="Admins" value={formatNumber(metrics.users.admins)} />
      <Stat
        label="Distributed"
        value={formatNaira(metrics.money.total_distributed)}
        hint="earnings paid into wallets"
      />
      <Stat
        label="Wallet liability"
        value={formatNaira(metrics.money.wallet_liability)}
        hint="unpaid balances"
      />
      <Stat
        label="Pending payouts"
        value={formatNaira(metrics.money.pending_withdrawals.amount)}
        hint={`${metrics.money.pending_withdrawals.count} pending`}
      />
      <Stat
        label="Campuses"
        value={formatNumber(metrics.campuses.total)}
        hint={`${metrics.campuses.funded} funded`}
      />
    </div>
  )
}
