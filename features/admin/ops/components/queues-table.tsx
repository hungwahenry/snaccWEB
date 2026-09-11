"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { humanize } from "@/features/admin/shell/utils/format"
import { formatNumber } from "@/lib/format"
import type { OpsQueue, QueueCounts, QueueDriver } from "../types"
import { missingCountsNote } from "../utils/ops"

function count(queue: OpsQueue, key: keyof QueueCounts) {
  return queue.counts ? formatNumber(queue.counts[key]) : "—"
}

export function QueuesTable({
  query,
  driver,
  onRetry,
}: {
  query: UseQueryResult<OpsQueue[]>
  driver: QueueDriver | undefined
  onRetry: (queue: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<OpsQueue>[]>(
    () => [
      {
        id: "queue",
        header: "Queue",
        cell: (queue) => (
          <div>
            <p className="font-medium">{humanize(queue.name)}</p>
            {queue.counts ? null : (
              <p className="text-xs text-muted-foreground">
                {missingCountsNote(driver)}
              </p>
            )}
          </div>
        ),
      },
      {
        id: "waiting",
        header: "Waiting",
        align: "end",
        className: "tabular-nums",
        cell: (queue) => count(queue, "waiting"),
      },
      {
        id: "active",
        header: "Running",
        align: "end",
        className: "tabular-nums",
        cell: (queue) => count(queue, "active"),
      },
      {
        id: "delayed",
        header: "Delayed",
        align: "end",
        className: "tabular-nums",
        cell: (queue) => count(queue, "delayed"),
      },
      {
        id: "failed",
        header: "Failed",
        align: "end",
        className: "tabular-nums",
        cell: (queue) =>
          queue.counts && queue.counts.failed > 0 ? (
            <span className="font-medium text-destructive">
              {formatNumber(queue.counts.failed)}
            </span>
          ) : (
            count(queue, "failed")
          ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (queue) =>
          queue.counts && queue.counts.failed > 0 ? (
            <CanAct permission="ops.run">
              <ActionButton
                variant="outline"
                size="sm"
                onClick={() => onRetry(queue.name)}
              >
                Retry failed
              </ActionButton>
            </CanAct>
          ) : null,
      },
    ],
    [driver, onRetry]
  )

  return (
    <QueryTable
      query={query}
      what="background jobs"
      title="Background jobs"
      columns={columns}
      rowKey={(queue) => queue.name}
      empty="No queues."
    />
  )
}
