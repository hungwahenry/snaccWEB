import type { DashboardMetrics, SafetyMetrics } from "../types"
import { BreakdownChart } from "./breakdown-chart"
import { ChartFrame } from "./chart-frame"
import {
  AllTimeReportsSection,
  ReasonsSection,
  SafetyStats,
  ScansSection,
} from "./safety-sections"

export function SafetyTab({
  safety,
  metrics,
}: {
  safety: SafetyMetrics
  metrics: DashboardMetrics
}) {
  return (
    <div className="flex flex-col gap-6">
      <SafetyStats safety={safety} />
      <ChartFrame
        title="Reports per day"
        description="Filed each day, by where they stand now."
      >
        <BreakdownChart breakdown={safety.reports} />
      </ChartFrame>
      <div className="grid gap-6 lg:grid-cols-2">
        <ReasonsSection reasons={safety.reasons} />
        <ScansSection scans={safety.scans} />
      </div>
      <AllTimeReportsSection moderation={metrics.moderation} />
    </div>
  )
}
