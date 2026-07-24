"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { DataPagination } from "@/components/data-pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatNaira } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import type { AdminUserRow, ListUsersParams } from "./types"

function initials(user: AdminUserRow) {
  const source = user.display_name || user.username || user.email
  return source.slice(0, 2).toUpperCase()
}

export function UsersTable({
  data,
  params,
  onParams,
}: {
  data: Paginated<AdminUserRow>
  params: ListUsersParams
  onParams: (patch: Partial<ListUsersParams>) => void
}) {
  const router = useRouter()
  const [search, setSearch] = useState(params.q ?? "")

  const roleValue = params.role ?? "all"
  const statusValue =
    params.suspended === true ? "suspended" : params.suspended === false ? "active" : "all"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <form
          className="flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            onParams({ q: search.trim() || undefined, page: 1 })
          }}
        >
          <Input
            placeholder="Search name, handle or email…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-xs"
          />
        </form>
        <Select
          value={roleValue}
          onValueChange={(value) =>
            onParams({ role: value && value !== "all" ? value : undefined, page: 1 })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusValue}
          onValueChange={(value) =>
            onParams({
              suspended: !value || value === "all" ? undefined : value === "suspended",
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Campus</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-sm">
                No users match these filters.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/users/${user.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={user.avatar_url} alt="" />
                      <AvatarFallback>{initials(user)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {user.display_name ?? "—"}
                      </div>
                      <div className="text-muted-foreground truncate text-xs">
                        {user.username ? `@${user.username}` : user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.university?.acronym ?? "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNaira(user.balance)}
                </TableCell>
                <TableCell>
                  {user.role === "admin" ? (
                    <Badge>admin</Badge>
                  ) : (
                    <Badge variant="outline">user</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.suspended_at ? (
                    <Badge variant="destructive">suspended</Badge>
                  ) : (
                    <Badge variant="secondary">active</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(user.created_at)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DataPagination
        page={data.page}
        lastPage={data.last_page}
        total={data.total}
        onPage={(page) => onParams({ page })}
      />
    </div>
  )
}
