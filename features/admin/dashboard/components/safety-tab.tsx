import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import {
  Section,
  Stat,
  StatGrid,
} from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { formatNumber, percent } from "@/lib/format"
import type {
  DashboardMetrics,
  ReportReasonRow,
  SafetyMetrics,
  ScanRow,
} from "../types"
import { countColumn } from "../utils/columns"
import { hoursLabel, share } from "../utils/dashboard"
import { ModerationSection } from "./activity-sections"
import { BreakdownChart } from "./breakdown-chart"
import { ChartFrame } from "./chart-frame"

const REASON_COLUMNS: Column<ReportReasonRow>[] = [
  { id: "reason", header: "Reason", cell: (row) => row.label },
  countColumn("total", "Filed", (row) => row.total),
  countColumn("open", "Open", (row) => row.open),
  countColumn("actioned", "Actioned", (row) => row.actioned),
  countColumn("dismissed", "Dismissed", (row) => row.dismissed),
]

const SCAN_COLUMNS: Column<ScanRow>[] = [
  { id: "surface", header: "Where", cell: (row) => row.label },
  countColumn("scanned", "Scanned", (row) => row.scanned),
  {
    id: "flagged",
    header: "Flagged",
    align: "end",
    className: "tabular-nums",
    cell: (row) =>
      `${formatNumber(row.flagged)} · ${percent(share(row.flagged, row.scanned))}`,
  },
  countColumn("acted", "Held or blocked", (row) => row.acted),
  countColumn("failed", "Failed", (row) => row.failed),
]

export function SafetyTab({
  safety,
  metrics,
}: {
  safety: SafetyMetrics
  metrics: DashboardMetrics
}) {
  const { review, suspensions } = safety

  return (
    <div className="flex flex-col gap-6">
      <StatGrid columns={4}>
        <Stat label="Open reports" value={formatNumber(review.open_now)} />
        <Stat
          label="Reviewed"
          value={formatNumber(review.reviewed)}
          hint={`typically within ${hoursLabel(review.median_hours)}`}
        />
        <Stat
          label="Filed by people"
          value={formatNumber(review.from_people)}
          hint={`${formatNumber(review.from_scans)} more by automatic scans`}
        />
        <Stat
          label="Suspended now"
          value={formatNumber(suspensions.suspended_now)}
          hint={`${formatNumber(suspensions.suspended_in_period)} suspended this period`}
        />
      </StatGrid>
      <ChartFrame
        title="Reports per day"
        description="Filed each day, by where they stand now."
      >
        <BreakdownChart breakdown={safety.reports} />
      </ChartFrame>
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Reports by reason" description="Filed this period.">
          <TableFrame>
            <DataTable
              columns={REASON_COLUMNS}
              rows={safety.reasons}
              rowKey={(row) => row.label}
              empty="No reports this period."
            />
          </TableFrame>
        </Section>
        <Section
          title="Automatic scans"
          description="What the classifier looked at this period."
        >
          <TableFrame>
            <DataTable
              columns={SCAN_COLUMNS}
              rows={safety.scans}
              rowKey={(row) => row.surface}
              empty="Nothing scanned this period."
            />
          </TableFrame>
        </Section>
      </div>
      <ModerationSection moderation={metrics.moderation} />
    </div>
  )
}
