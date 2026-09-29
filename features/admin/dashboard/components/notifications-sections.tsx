import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { Section } from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { percent } from "@/lib/format"
import type { NotificationTypeRow } from "../types"
import { countColumn } from "../utils/columns"
import { share } from "../utils/dashboard"

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

export function NotificationTypesSection({
  types,
}: {
  types: NotificationTypeRow[]
}) {
  return (
    <Section
      title="By kind"
      description="This period. Messages and rooms push straight to the phone, so they are not counted here."
    >
      <TableFrame>
        <DataTable
          columns={TYPE_COLUMNS}
          rows={types}
          rowKey={(row) => row.type}
          empty="No notifications this period."
        />
      </TableFrame>
    </Section>
  )
}
