import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { Section } from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { percent } from "@/lib/format"
import type { NotificationMetrics, NotificationTypeRow } from "../types"
import { countColumn } from "../utils/columns"
import { share } from "../utils/dashboard"
import { BreakdownChart } from "./breakdown-chart"
import { ChartFrame } from "./chart-frame"

const TYPE_COLUMNS: Column<NotificationTypeRow>[] = [
  { id: "type", header: "Kind", cell: (row) => row.label },
  countColumn("sent", "Made", (row) => row.sent),
  countColumn("pushed", "Pushed", (row) => row.pushed),
  {
    id: "read",
    header: "Read",
    align: "end",
    className: "tabular-nums",
    cell: (row) => percent(share(row.read, row.sent)),
  },
]

export function NotificationsTab({
  notifications,
}: {
  notifications: NotificationMetrics
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartFrame
          title="Made, pushed and opened"
          description="Notifications in the app, how many also went out as a push, and how many people opened one."
        >
          <BreakdownChart breakdown={notifications.flow} variant="lines" />
        </ChartFrame>
        <ChartFrame
          title="By section"
          description="The same notifications, by the settings section they belong to."
        >
          <BreakdownChart breakdown={notifications.sections} />
        </ChartFrame>
      </div>
      <Section
        title="By kind"
        description="This period. Messages and rooms push straight to the phone, so they are not counted here."
      >
        <TableFrame>
          <DataTable
            columns={TYPE_COLUMNS}
            rows={notifications.types}
            rowKey={(row) => row.type}
            empty="No notifications this period."
          />
        </TableFrame>
      </Section>
    </div>
  )
}
