import type { UseQueryResult } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import type { Paginated } from "@/lib/api/types"
import { formatDate, formatNaira } from "@/lib/format"
import type { AdminEarning } from "../types"
import { earningCause, earningLabel, partyHandle } from "../utils/earnings"

const COLUMNS: Column<AdminEarning>[] = [
  {
    id: "type",
    header: "Type",
    cell: (event) => <Badge variant="outline">{earningLabel(event)}</Badge>,
  },
  {
    id: "amount",
    header: "Amount",
    align: "end",
    className: "tabular-nums",
    cell: (event) => formatNaira(event.amount),
  },
  {
    id: "beneficiary",
    header: "Beneficiary",
    className: "text-sm",
    cell: (event) => partyHandle(event.beneficiary) ?? "—",
  },
  {
    id: "cause",
    header: "From",
    className: "text-sm text-muted-foreground",
    cell: earningCause,
  },
  {
    id: "when",
    header: "When",
    className: "text-sm text-muted-foreground",
    cell: (event) => formatDate(event.created_at),
  },
]

export function EarningsTable({
  query,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<AdminEarning>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="earnings"
      title="Earning events"
      columns={COLUMNS}
      rowKey={(event) => event.id}
      empty="No earning events."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
