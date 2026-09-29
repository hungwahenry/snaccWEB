import type { UseQueryResult } from "@tanstack/react-query"
import { QueryView } from "@/features/admin/shell/components/query-view"
import type { DashboardMetrics, GrowthMetrics } from "../types"
import { GrowthSection } from "./growth-section"
import { HeadlineStats } from "./headline-stats"
import { TrendsSection } from "./trends-section"

export function OverviewTab({
  metrics,
  growth,
}: {
  metrics: DashboardMetrics
  growth: UseQueryResult<GrowthMetrics>
}) {
  return (
    <div className="flex flex-col gap-6">
      <HeadlineStats metrics={metrics} />
      <TrendsSection
        days={metrics.days}
        series={metrics.series}
        totals={metrics.totals}
      />
      <QueryView query={growth} what="signups">
        {(data) => <GrowthSection days={metrics.days} growth={data} />}
      </QueryView>
    </div>
  )
}
