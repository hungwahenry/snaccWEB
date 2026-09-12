"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import type { Paginated } from "@/lib/api/types"
import { formatDate, formatNaira } from "@/lib/format"
import type { AdminUserRow } from "../types"
import { accountStatus, userSubtitle } from "../utils/users"

const COLUMNS: Column<AdminUserRow>[] = [
  {
    id: "user",
    header: "Account",
    cell: (user) => <UserCell user={user} note={userSubtitle(user)} />,
  },
  {
    id: "campus",
    header: "Campus",
    className: "text-muted-foreground",
    cell: (user) => user.university?.acronym ?? "—",
  },
  {
    id: "earnings",
    header: "Unclaimed",
    align: "end",
    className: "tabular-nums",
    cell: (user) => formatNaira(user.balance),
  },
  {
    id: "status",
    header: "Status",
    cell: (user) => (
      <span className="flex gap-1.5">
        <StatusBadge status={accountStatus(user)} />
        {user.role === "admin" ? <Badge>Owner</Badge> : null}
        {user.is_private ? <Badge variant="outline">Private</Badge> : null}
      </span>
    ),
  },
  {
    id: "joined",
    header: "Joined",
    className: "text-muted-foreground",
    cell: (user) => formatDate(user.created_at),
  },
]

export function UsersTable({
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
      what="users"
      columns={COLUMNS}
      rowKey={(user) => user.id}
      empty="No accounts match these filters."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
