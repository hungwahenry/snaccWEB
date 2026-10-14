"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import type { ReactNode } from "react"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { postingPath } from "@/features/admin/shell/routes"
import type { Paginated } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import { formatMoney } from "@/lib/money"
import type { WalletTransactionRow } from "../types"
import { TRANSACTION_LABELS } from "../utils/wallet"

const COLUMNS: Column<WalletTransactionRow>[] = [
  {
    id: "when",
    header: "When",
    className: "whitespace-nowrap",
    cell: (row) => formatDate(row.created_at),
  },
  {
    id: "kind",
    header: "Kind",
    cell: (row) => TRANSACTION_LABELS[row.type],
  },
  {
    id: "reference",
    header: "Reference",
    hideBelow: "md",
    cell: (row) => (
      <Link
        href={postingPath(row.id)}
        className="font-mono text-xs hover:underline"
      >
        {row.reference}
      </Link>
    ),
  },
  {
    id: "who",
    header: "Who",
    cell: (row) =>
      row.user ? (
        <UserCell user={row.user} size="sm" />
      ) : (
        <span className="text-xs text-muted-foreground">Snacc</span>
      ),
  },
  {
    id: "amount",
    header: "Amount",
    align: "end",
    className: "tabular-nums",
    cell: (row) => (
      <Link href={postingPath(row.id)} className="hover:underline">
        {formatMoney(row.amount)}
      </Link>
    ),
  },
]

export function LedgerTable({
  query,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<WalletTransactionRow>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="the ledger"
      columns={COLUMNS}
      rowKey={(row) => row.id}
      empty="No postings match that."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
