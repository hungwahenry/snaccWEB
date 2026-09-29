import {
  Section,
  Stat,
  StatGrid,
} from "@/features/admin/shell/components/detail"
import { formatNumber } from "@/lib/format"
import type { DashboardMetrics } from "../types"

export function HeadlineStats({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <Section title="All time">
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
        <Stat
          label="Campuses"
          value={formatNumber(metrics.campuses.total)}
          hint={`${formatNumber(metrics.campuses.funded)} funded`}
        />
        <Stat
          label="Open reports"
          value={formatNumber(metrics.moderation.open_reports)}
          hint={`${formatNumber(metrics.moderation.reports_7d)} in last 7 days`}
        />
      </StatGrid>
    </Section>
  )
}
