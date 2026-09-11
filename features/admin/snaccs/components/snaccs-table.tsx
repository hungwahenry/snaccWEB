"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { snaccPath } from "@/features/admin/shell/routes"
import type { Paginated } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import type { AdminSnacc, SnaccActions } from "../types"
import { engagementLine, snaccPreview, snaccStatus } from "../utils/snaccs"

function RowActions({
  snacc,
  actions,
}: {
  snacc: AdminSnacc
  actions: SnaccActions
}) {
  if (snacc.deleted_at) {
    return <span className="text-sm text-muted-foreground">Removed</span>
  }
  if (snacc.held_at) {
    return (
      <CanAct permission="snaccs.hold">
        <ConfirmAction
          trigger={
            <Button variant="outline" size="sm">
              Release
            </Button>
          }
          tone="default"
          title="Put this snacc back?"
          description="It becomes visible in every feed again, replies included."
          confirmLabel="Release it"
          onConfirm={() => actions.release(snacc.id)}
        />
      </CanAct>
    )
  }

  return (
    <div className="flex justify-end gap-2">
      <CanAct permission="snaccs.hold">
        <ConfirmAction
          trigger={
            <Button variant="ghost" size="sm">
              Hold
            </Button>
          }
          title="Hold this snacc?"
          description="It is hidden from every feed while you decide, and its replies go with it. Nothing is deleted."
          confirmLabel="Hold it"
          onConfirm={() => actions.hold(snacc.id)}
        />
      </CanAct>
      <ActionButton
        variant="ghost"
        size="sm"
        onClick={() =>
          snacc.pinned ? actions.unpin(snacc.id) : actions.pin(snacc.id)
        }
      >
        {snacc.pinned ? "Unpin" : "Pin"}
      </ActionButton>
      <ConfirmAction
        trigger={
          <Button variant="outline" size="sm">
            Remove
          </Button>
        }
        title="Remove snacc"
        description="This is permanent. Replies go with it, the author's counts unwind, and what it earned is retracted. To take it out of sight reversibly, hold it instead."
        confirmLabel="Remove"
        reason={{ label: "Reason" }}
        onConfirm={(reason) => actions.remove(snacc.id, reason)}
      />
    </div>
  )
}

export function SnaccsTable({
  query,
  toolbar,
  onPageChange,
  actions,
}: {
  query: UseQueryResult<Paginated<AdminSnacc>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  actions: SnaccActions
}) {
  const columns = useMemo<Column<AdminSnacc>[]>(
    () => [
      {
        id: "author",
        header: "Author",
        cell: (snacc) => <UserCell user={snacc.author} />,
      },
      {
        id: "content",
        header: "Content",
        className: "max-w-xs",
        cell: (snacc) => (
          <>
            <Link
              href={snaccPath(snacc.id)}
              className="block truncate text-sm font-medium underline-offset-4 hover:underline"
            >
              {snaccPreview(snacc)}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatDate(snacc.created_at)}
            </p>
          </>
        ),
      },
      {
        id: "engagement",
        header: "Engagement",
        align: "end",
        className: "text-xs text-muted-foreground tabular-nums",
        cell: (snacc) => engagementLine(snacc),
      },
      {
        id: "reports",
        header: "Reports",
        align: "end",
        className: "tabular-nums",
        cell: (snacc) =>
          snacc.reports_count > 0 ? (
            <Badge variant="destructive">{snacc.reports_count}</Badge>
          ) : (
            <span className="text-muted-foreground">0</span>
          ),
      },
      {
        id: "status",
        header: "Status",
        cell: (snacc) => <StatusBadge status={snaccStatus(snacc)} />,
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (snacc) => <RowActions snacc={snacc} actions={actions} />,
      },
    ],
    [actions]
  )

  return (
    <QueryTable
      query={query}
      what="snaccs"
      columns={columns}
      rowKey={(snacc) => snacc.id}
      empty="No snaccs match these filters."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
