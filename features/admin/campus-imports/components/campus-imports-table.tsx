import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import type { ReactNode } from "react"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { campusImportPath } from "@/features/admin/shell/routes"
import type { Paginated } from "@/lib/api/types"
import { formatDate, formatNumber } from "@/lib/format"
import type { CampusImport } from "../types"
import { IMPORT_STATUS, importTitle, startedBy } from "../utils/campus-imports"

const COLUMNS: Column<CampusImport>[] = [
  {
    id: "import",
    header: "Import",
    className: "max-w-xs",
    cell: (run) => (
      <>
        <Link
          href={campusImportPath(run.id)}
          className="block truncate text-sm font-medium underline-offset-4 hover:underline"
        >
          {importTitle(run)}
        </Link>
        <p className="text-xs text-muted-foreground">{run.country.name}</p>
      </>
    ),
  },
  {
    id: "status",
    header: "Status",
    className: "max-w-xs",
    cell: (run) => (
      <>
        <StatusBadge status={IMPORT_STATUS[run.status]} />
        {run.problem ? (
          <p className="mt-1 text-xs text-pretty text-muted-foreground">
            {run.problem}
          </p>
        ) : null}
      </>
    ),
  },
  {
    id: "rows",
    header: "Campuses",
    align: "end",
    className: "tabular-nums",
    cell: (run) => (
      <>
        <p>{formatNumber(run.rows.total)}</p>
        <p className="text-xs text-muted-foreground">
          {formatNumber(run.rows.new)} new · {formatNumber(run.rows.similar)}{" "}
          look like ours
        </p>
      </>
    ),
  },
  {
    id: "started",
    header: "Started",
    cell: (run) => (
      <>
        <p className="text-sm">{formatDate(run.created_at)}</p>
        <p className="text-xs text-muted-foreground">{startedBy(run)}</p>
      </>
    ),
  },
]

export function CampusImportsTable({
  query,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<CampusImport>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="campus imports"
      columns={COLUMNS}
      rowKey={(run) => run.id}
      empty="No imports yet. Import a file or check a country's campuses to start one."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
