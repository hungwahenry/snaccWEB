"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import type { NotificationTypeDraft, NotificationTypeRow } from "../types"
import { groupingText } from "../utils/notification-types"
import { NotificationTypeDialog } from "./notification-type-dialog"

export function NotificationTypesTable({
  query,
  toolbar,
  onSave,
}: {
  query: UseQueryResult<NotificationTypeRow[]>
  toolbar: ReactNode
  onSave: (key: string, draft: NotificationTypeDraft) => Promise<unknown>
}) {
  const columns = useMemo<Column<NotificationTypeRow>[]>(
    () => [
      {
        id: "notification",
        header: "Notification",
        cell: (row) => (
          <div className="min-w-0">
            <p className="text-sm font-medium">{row.label}</p>
            <p className="font-mono text-xs text-muted-foreground">{row.key}</p>
          </div>
        ),
      },
      {
        id: "wording",
        header: "What it says",
        className: "text-sm whitespace-normal text-muted-foreground",
        cell: (row) => row.body_template,
      },
      {
        id: "delivery",
        header: "Delivery",
        cell: (row) => (
          <div className="flex flex-wrap gap-1">
            {row.default_push ? <Badge variant="secondary">Push</Badge> : null}
            {row.instant_email ? (
              <Badge variant="secondary">Email now</Badge>
            ) : row.default_email ? (
              <Badge variant="outline">Digest</Badge>
            ) : null}
            {row.locked ? <Badge variant="outline">Always on</Badge> : null}
          </div>
        ),
      },
      {
        id: "grouping",
        header: "Grouping",
        className: "text-sm text-muted-foreground",
        cell: (row) => groupingText(row),
      },
      {
        id: "edit",
        header: <HiddenHeader>Edit</HiddenHeader>,
        align: "end",
        cell: (row) => (
          <CanAct permission="notification_types.write">
            <NotificationTypeDialog
              row={row}
              trigger={
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              }
              onSubmit={(draft) => onSave(row.key, draft)}
            />
          </CanAct>
        ),
      },
    ],
    [onSave]
  )

  return (
    <QueryTable
      query={query}
      what="notifications"
      columns={columns}
      rowKey={(row) => row.key}
      empty="No notifications match that."
      toolbar={toolbar}
    />
  )
}
