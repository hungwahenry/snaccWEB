"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { userPath } from "@/features/admin/shell/routes"
import { userName } from "@/features/admin/shell/utils/user"
import type { Paginated } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import type { WebhookEvent } from "../types"
import { providerLabel, WEBHOOK_STATUS } from "../utils/webhooks"

export function WebhooksTable({
  query,
  toolbar,
  onPageChange,
  onOpen,
}: {
  query: UseQueryResult<Paginated<WebhookEvent>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onOpen: (id: string) => void
}) {
  const columns = useMemo<Column<WebhookEvent>[]>(
    () => [
      {
        id: "provider",
        header: "Provider",
        cell: (event) => providerLabel(event.provider),
      },
      {
        id: "event",
        header: "Event",
        className: "font-medium",
        cell: (event) => event.type,
      },
      {
        id: "who",
        header: "Who",
        className: "text-muted-foreground",
        cell: (event) =>
          event.user ? (
            <Link
              href={userPath(event.user.id)}
              className="underline-offset-4 hover:underline"
            >
              {userName(event.user)}
            </Link>
          ) : (
            "—"
          ),
      },
      {
        id: "outcome",
        header: "Outcome",
        className: "max-w-xs whitespace-normal",
        cell: (event) => (
          <div className="flex flex-col items-start gap-1">
            <StatusBadge status={WEBHOOK_STATUS[event.status]} />
            {event.note ? (
              <span className="text-xs text-muted-foreground">
                {event.note}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        id: "received",
        header: "Received",
        className: "text-muted-foreground tabular-nums",
        cell: (event) => formatDate(event.created_at),
      },
      {
        id: "payload",
        header: <HiddenHeader>Payload</HiddenHeader>,
        align: "end",
        cell: (event) => (
          <Button variant="ghost" size="sm" onClick={() => onOpen(event.id)}>
            View payload
          </Button>
        ),
      },
    ],
    [onOpen]
  )

  return (
    <QueryTable
      query={query}
      what="the log"
      title="Log"
      description="Every delivery is recorded before it is acted on, so one that changed nothing is still here with the reason why. A provider that redelivers is applied once — unless the first attempt failed, which is retried."
      columns={columns}
      rowKey={(event) => event.id}
      empty="Nothing delivered yet."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
