import { Stat, StatGrid } from "@/features/admin/shell/components/detail"
import { formatNaira, formatNumber } from "@/lib/format"
import type { DashboardMetrics } from "../types"

export function HeadlineStats({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <StatGrid columns={3}>
      <Stat
        label="Users"
        value={formatNumber(metrics.users.total)}
        hint={`${formatNumber(metrics.users.verified)} verified · ${formatNumber(metrics.users.suspended)} suspended`}
      />
      <Stat
        label="Posts"
        value={formatNumber(metrics.content.snaccs)}
        hint={`${formatNumber(metrics.content.comments)} comments · ${formatNumber(metrics.content.resnaccs)} resnaccs`}
      />
      <Stat
        label="Reactions"
        value={formatNumber(metrics.engagement.reactions)}
      />
      <Stat label="Views" value={formatNumber(metrics.engagement.views)} />
      {metrics.money ? (
        <Stat
          label="Wallet liability"
          value={formatNaira(metrics.money.wallet_liability)}
          hint="unpaid balances"
        />
      ) : null}
      <Stat
        label="Open reports"
        value={formatNumber(metrics.moderation.open_reports)}
        hint={`${formatNumber(metrics.moderation.reports_7d)} in last 7 days`}
      />
    </StatGrid>
  )
}
