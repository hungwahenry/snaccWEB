import { Badge } from "@/components/ui/badge"
import { BarRow } from "@/features/admin/shell/components/bar-row"
import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { formatNumber } from "@/lib/format"
import type { CampusRow } from "../types"
import { countColumn } from "../utils/columns"
import { mostActiveCampuses, share } from "../utils/dashboard"

const COLUMNS: Column<CampusRow>[] = [
  {
    id: "campus",
    header: "Campus",
    cell: (campus) => (
      <>
        <span className="font-medium">{campus.acronym}</span>
        <span className="ml-2 text-xs text-muted-foreground">
          {campus.name}
        </span>
        {campus.funded ? (
          <Badge variant="secondary" className="ml-2">
            Funded
          </Badge>
        ) : null}
      </>
    ),
  },
  countColumn<CampusRow>("members", "Members", (campus) => campus.members),
  countColumn<CampusRow>("joined", "Joined", (campus) => campus.joined),
  countColumn<CampusRow>(
    "weekly",
    "Active this week",
    (campus) => campus.weekly_active
  ),
  countColumn<CampusRow>("posts", "Posts", (campus) => campus.posts),
]

export function CampusesTab({
  campuses,
  days,
}: {
  campuses: CampusRow[]
  days: number
}) {
  const active = mostActiveCampuses(campuses)
  const most = active[0]?.weekly_active ?? 0

  return (
    <div className="flex flex-col gap-6">
      <Section
        title="Most active this week"
        description="People active on each campus in the last 7 days."
      >
        {active.length === 0 ? (
          <EmptyNote>Nobody has been active this week.</EmptyNote>
        ) : (
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            {active.map((campus) => (
              <BarRow
                key={campus.id}
                label={campus.acronym}
                value={formatNumber(campus.weekly_active)}
                fraction={share(campus.weekly_active, most)}
              />
            ))}
          </div>
        )}
      </Section>
      <Section
        title="Every campus"
        description={`Joined and posts count the last ${days} days.`}
      >
        <TableFrame>
          <DataTable
            columns={COLUMNS}
            rows={campuses}
            rowKey={(campus) => campus.id}
            empty="No campuses with members yet."
          />
        </TableFrame>
      </Section>
    </div>
  )
}
