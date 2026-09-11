"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import type { Paginated } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import type { AdminUserRow } from "../types"
import { userSubtitle } from "../utils/users"

const COLUMNS: Column<AdminUserRow>[] = [
  {
    id: "user",
    header: "Account",
    cell: (user) => <UserCell user={user} note={userSubtitle(user)} />,
  },
  {
    id: "reason",
    header: "Reason",
    cell: (user) =>
      user.suspended_reason ? (
        <Badge variant="secondary">{user.suspended_reason.label}</Badge>
      ) : (
        <span className="text-muted-foreground">Not given</span>
      ),
  },
  {
    id: "note",
    header: "Note",
    className: "max-w-sm whitespace-normal text-muted-foreground",
    cell: (user) => (
      <span className="line-clamp-2">{user.suspended_note ?? "—"}</span>
    ),
  },
  {
    id: "since",
    header: "Since",
    cell: (user) => formatDate(user.suspended_at),
  },
  {
    id: "until",
    header: "Until",
    cell: (user) =>
      user.suspended_until ? (
        formatDate(user.suspended_until)
      ) : (
        <Badge variant="destructive">Until lifted</Badge>
      ),
  },
]

export function SuspensionsTable({
  query,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<AdminUserRow>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="suspensions"
      columns={COLUMNS}
      rowKey={(user) => user.id}
      empty="Nobody is suspended."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
