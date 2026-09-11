import { Badge } from "@/components/ui/badge"
import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { formatNumber } from "@/lib/format"
import type { DashboardMetrics, TopCampus, TopReaction } from "../types"

const CAMPUS_COLUMNS: Column<TopCampus>[] = [
  {
    id: "campus",
    header: "Campus",
    cell: (campus) => (
      <>
        <span className="font-medium">{campus.acronym}</span>
        <span className="ml-2 text-xs text-muted-foreground">
          {campus.name}
        </span>
      </>
    ),
  },
  {
    id: "members",
    header: "Members",
    align: "end",
    className: "tabular-nums",
    cell: (campus) => formatNumber(campus.members),
  },
  {
    id: "snaccs",
    header: "Snaccs",
    align: "end",
    className: "tabular-nums",
    cell: (campus) => formatNumber(campus.snaccs),
  },
]

export function TopCampusesSection({
  campuses,
  top,
}: {
  campuses: DashboardMetrics["campuses"]
  top: TopCampus[]
}) {
  return (
    <Section
      title="Top campuses"
      description={`${formatNumber(campuses.funded)} of ${formatNumber(campuses.total)} funded`}
    >
      <TableFrame>
        <DataTable
          columns={CAMPUS_COLUMNS}
          rows={top}
          rowKey={(campus) => campus.id}
          empty="No campuses with members yet."
        />
      </TableFrame>
    </Section>
  )
}

export function TopReactionsSection({
  reactions,
}: {
  reactions: TopReaction[]
}) {
  return (
    <Section title="Top reactions">
      {reactions.length === 0 ? (
        <EmptyNote>No reactions yet.</EmptyNote>
      ) : (
        <div className="flex flex-wrap gap-2 rounded-lg border p-4">
          {reactions.map((reaction) => (
            <Badge
              key={reaction.emoji}
              variant="secondary"
              className="gap-1.5 text-sm"
            >
              <span>{reaction.emoji}</span>
              <span className="tabular-nums">
                {formatNumber(reaction.count)}
              </span>
            </Badge>
          ))}
        </div>
      )}
    </Section>
  )
}
