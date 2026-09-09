"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserCell } from "@/features/admin/shell/ui/user-cell"
import { TableFrame } from "@/components/data-table/table-frame"
import { formatDate } from "@/lib/format"
import type { AdminAccount } from "../types"

export function AdminsTable({ admins }: { admins: AdminAccount[] }) {
  return (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Since</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                Nobody holds a role yet.
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <UserCell
                    user={{
                      id: admin.id,
                      username: admin.username,
                      display_name: admin.display_name,
                      avatar_url: admin.avatar_url,
                    }}
                  />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {admin.email}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {admin.grants.map((grant) => (
                      <Badge
                        key={grant.id}
                        variant={grant.role.allow_all ? "default" : "outline"}
                      >
                        {grant.role.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(admin.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/users/${admin.id}`} />}
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableFrame>
  )
}
