import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import type { ReactNode } from "react"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { withdrawalPath } from "@/features/admin/shell/routes"
import type { Paginated } from "@/lib/api/types"
import { formatDate, formatNaira } from "@/lib/format"
import type { AdminWithdrawal } from "../types"
import { WITHDRAWAL_STATUS } from "../utils/status"

const COLUMNS: Column<AdminWithdrawal>[] = [
  {
    id: "reference",
    header: "Reference",
    cell: (withdrawal) => (
      <Link
        href={withdrawalPath(withdrawal.id)}
        className="font-mono text-xs font-medium underline-offset-4 hover:underline"
      >
        {withdrawal.reference}
      </Link>
    ),
  },
  {
    id: "user",
    header: "Who",
    cell: (withdrawal) => <UserCell user={withdrawal.user} size="sm" />,
  },
  {
    id: "amount",
    header: "Amount",
    align: "end",
    className: "tabular-nums",
    cell: (withdrawal) => formatNaira(withdrawal.amount),
  },
  {
    id: "status",
    header: "Status",
    cell: (withdrawal) => (
      <StatusBadge status={WITHDRAWAL_STATUS[withdrawal.status]} />
    ),
  },
  {
    id: "requested",
    header: "Asked for",
    className: "text-muted-foreground",
    cell: (withdrawal) => formatDate(withdrawal.created_at),
  },
]

export function WithdrawalsTable({
  query,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<AdminWithdrawal>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="withdrawals"
      columns={COLUMNS}
      rowKey={(withdrawal) => withdrawal.id}
      empty="No withdrawals match these filters."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
