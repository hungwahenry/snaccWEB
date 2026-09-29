import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import {
  Fact,
  Facts,
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

export function SafetyStats({ safety }: { safety: SafetyMetrics }) {
  const { review, suspensions } = safety

  return (
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
  )
}

export function ReasonsSection({ reasons }: { reasons: ReportReasonRow[] }) {
  return (
    <Section title="Reports by reason" description="Filed this period.">
      <TableFrame>
        <DataTable
          columns={REASON_COLUMNS}
          rows={reasons}
          rowKey={(row) => row.label}
          empty="No reports this period."
        />
      </TableFrame>
    </Section>
  )
}

export function ScansSection({ scans }: { scans: ScanRow[] }) {
  return (
    <Section
      title="Automatic scans"
      description="What the classifier looked at this period."
    >
      <TableFrame>
        <DataTable
          columns={SCAN_COLUMNS}
          rows={scans}
          rowKey={(row) => row.surface}
          empty="Nothing scanned this period."
        />
      </TableFrame>
    </Section>
  )
}

export function AllTimeReportsSection({
  moderation,
}: {
  moderation: DashboardMetrics["moderation"]
}) {
  return (
    <Section title="All-time reports">
      <Facts>
        <Fact
          label="Open reports"
          value={formatNumber(moderation.open_reports)}
        />
        <Fact label="Actioned" value={formatNumber(moderation.actioned)} />
        <Fact label="Dismissed" value={formatNumber(moderation.dismissed)} />
        <Fact
          label="Filed in last 7 days"
          value={formatNumber(moderation.reports_7d)}
        />
      </Facts>
    </Section>
  )
}
