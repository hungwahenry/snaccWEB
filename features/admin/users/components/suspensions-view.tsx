"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { DataTable, type Column } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import { queryOf, useListParams } from "@/lib/use-list-params"
import { UserCell } from "@/components/admin/user-cell"
import type { AdminUserRow } from "../types"
import { useUsers } from "../hooks/use-users"

export function SuspensionsView() {
  const router = useRouter()
  const { params, set, setPage, reset, active } = useListParams()
  const query = useUsers(
    queryOf({ page: params.page, perPage: 20, q: params.q, suspended: true })
  )

  const columns = useMemo<Column<AdminUserRow>[]>(
    () => [
      {
        id: "user",
        header: "Account",
        cell: ({ row }) => (
          <UserCell
            user={{
              id: row.original.id,
              username: row.original.username,
              display_name: row.original.display_name,
              avatar_url: row.original.avatar_url,
            }}
          />
        ),
      },
      {
        id: "reason",
        header: "Reason",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.suspended_reason ? (
            <Badge variant="secondary">
              {row.original.suspended_reason.label}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">Not given</span>
          ),
      },
      {
        id: "note",
        header: "Note",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="line-clamp-2 max-w-sm text-sm text-muted-foreground">
            {row.original.suspended_note ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "suspended_at",
        header: "Since",
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap">
            {formatDate(row.original.suspended_at)}
          </span>
        ),
      },
      {
        id: "until",
        header: "Until",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.suspended_until ? (
            <span className="text-sm whitespace-nowrap">
              {formatDate(row.original.suspended_until)}
            </span>
          ) : (
            <Badge variant="destructive">Indefinite</Badge>
          ),
      },
    ],
    []
  )

  return (
    <DataTable
      columns={columns}
      rows={query.data?.items}
      isPending={query.isPending}
      page={query.data?.page ?? params.page}
      perPage={query.data?.per_page ?? 20}
      total={query.data?.total ?? 0}
      onPageChange={setPage}
      onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
      empty="Nobody is suspended."
      toolbar={
        <DataTableToolbar
          search={params.q}
          onSearchChange={(q) => set({ q })}
          placeholder="Username, name or email…"
          onReset={active ? reset : undefined}
        />
      }
    />
  )
}
