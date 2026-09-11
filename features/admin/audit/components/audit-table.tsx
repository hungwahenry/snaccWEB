"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { userPath } from "@/features/admin/shell/routes"
import { humanize, shortId } from "@/features/admin/shell/utils/format"
import type { Paginated } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { AuditLog } from "../types"
import {
  actionLabel,
  adminLabel,
  hasSnapshot,
  targetHref,
} from "../utils/audit"
import { AuditChangeDialog } from "./audit-change-dialog"

const LINK = "underline-offset-4 hover:underline"

function Target({ log }: { log: AuditLog }) {
  const href = targetHref(log)
  const id = log.target_id

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Badge variant="outline">{humanize(log.target_type)}</Badge>
      {id === null ? null : href ? (
        <Link href={href} title={id} className={cn("font-mono text-xs", LINK)}>
          {shortId(id)}
        </Link>
      ) : (
        <span title={id} className="font-mono text-xs text-muted-foreground">
          {shortId(id)}
        </span>
      )}
    </div>
  )
}

const COLUMNS: Column<AuditLog>[] = [
  {
    id: "action",
    header: "Action",
    cell: (log) => (
      <div className="min-w-0">
        <p className="font-medium">{actionLabel(log.action)}</p>
        <p className="font-mono text-xs text-muted-foreground">{log.action}</p>
      </div>
    ),
  },
  {
    id: "admin",
    header: "Admin",
    cell: (log) => (
      <Link href={userPath(log.admin_id)} className={cn("text-sm", LINK)}>
        {adminLabel(log)}
      </Link>
    ),
  },
  {
    id: "target",
    header: "Target",
    cell: (log) => <Target log={log} />,
  },
  {
    id: "when",
    header: "When",
    className: "text-muted-foreground",
    cell: (log) => formatDate(log.created_at),
  },
  {
    id: "detail",
    header: <HiddenHeader>Before and after</HiddenHeader>,
    align: "end",
    cell: (log) =>
      hasSnapshot(log) ? (
        <AuditChangeDialog
          log={log}
          trigger={
            <Button variant="ghost" size="sm">
              View change
            </Button>
          }
        />
      ) : null,
  },
]

export function AuditTable({
  query,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<AuditLog>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="the audit log"
      columns={COLUMNS}
      rowKey={(log) => log.id}
      empty="Nothing in the log matches that."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
