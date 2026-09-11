"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { userPath } from "@/features/admin/shell/routes"
import { formatDate } from "@/lib/format"
import type { AdminAccount } from "../types"
import { grantLabel, grantVariant } from "@/features/admin/roles/utils/roles"
import { adminRef, adminSince } from "../utils/admins"

export function AdminsTable({
  query,
  acronyms,
}: {
  query: UseQueryResult<AdminAccount[]>
  acronyms: ReadonlyMap<string, string>
}) {
  const columns = useMemo<Column<AdminAccount>[]>(
    () => [
      {
        id: "person",
        header: "Person",
        cell: (admin) => <UserCell user={adminRef(admin)} />,
      },
      {
        id: "email",
        header: "Email",
        className: "text-muted-foreground",
        cell: (admin) => admin.email,
      },
      {
        id: "roles",
        header: "Roles",
        className: "whitespace-normal",
        cell: (admin) => (
          <div className="flex flex-wrap gap-1">
            {admin.is_owner_account ? <Badge>Owner</Badge> : null}
            {admin.grants.map((grant) => (
              <Badge key={grant.id} variant={grantVariant(grant)}>
                {grantLabel(grant, acronyms)}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        id: "since",
        header: "Admin since",
        className: "text-muted-foreground",
        cell: (admin) => formatDate(adminSince(admin)),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (admin) => (
          <Button
            variant="outline"
            size="sm"
            render={<Link href={userPath(admin.id)} />}
          >
            Manage
          </Button>
        ),
      },
    ],
    [acronyms]
  )

  return (
    <QueryTable
      query={query}
      what="admins"
      columns={columns}
      rowKey={(admin) => admin.id}
      empty="Nobody holds a role yet."
    />
  )
}
