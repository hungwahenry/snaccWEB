"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { Flag, Trash2, Undo2 } from "lucide-react"
import { useMemo, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { plural } from "@/features/admin/shell/utils/format"
import type { Paginated } from "@/lib/api/types"
import { formatDate, formatNumber } from "@/lib/format"
import type { MomentRow } from "../types"

export function MomentsTable({
  query,
  toolbar,
  onPageChange,
  onRelease,
  onRemove,
}: {
  query: UseQueryResult<Paginated<MomentRow>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onRelease: (id: string) => Promise<unknown>
  onRemove: (id: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<MomentRow>[]>(
    () => [
      {
        id: "moment",
        header: "Moment",
        cell: (moment) => (
          <div className="flex items-center gap-3">
            {moment.image_url ? (
              <img
                src={moment.image_url}
                alt=""
                className="h-12 w-9 rounded object-cover"
              />
            ) : (
              <div
                className="flex h-12 w-9 items-center justify-center rounded text-[10px]"
                style={{ background: moment.background ?? "var(--muted)" }}
              >
                Aa
              </div>
            )}
            <span className="line-clamp-2 max-w-sm text-sm">
              {moment.body ?? "—"}
            </span>
          </div>
        ),
      },
      {
        id: "author",
        header: "Author",
        cell: (moment) => <UserCell user={moment.author} />,
      },
      {
        id: "views",
        header: "Views",
        className: "tabular-nums",
        cell: (moment) => formatNumber(moment.views_count),
      },
      {
        id: "state",
        header: "State",
        cell: (moment) => (
          <div className="flex flex-wrap gap-1">
            {moment.deleted_at ? (
              <Badge variant="destructive">Removed</Badge>
            ) : null}
            {moment.held_at ? (
              <Badge variant="outline">
                <Flag className="size-3" />
                Held
              </Badge>
            ) : null}
            {moment.reports_count > 0 ? (
              <Badge variant="secondary">
                {plural(moment.reports_count, "report")}
              </Badge>
            ) : null}
          </div>
        ),
      },
      {
        id: "posted",
        header: "Posted",
        className: "whitespace-nowrap",
        cell: (moment) => formatDate(moment.created_at),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (moment) => (
          <div className="flex justify-end gap-1">
            {moment.held_at ? (
              <CanAct permission="moments.read">
                <ConfirmAction
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Undo2 />
                      Release
                    </Button>
                  }
                  title="Release this moment?"
                  description="It stops being held for review, so the next purge deletes it for good. Decide from what you can see now."
                  confirmLabel="Release it"
                  onConfirm={() => onRelease(moment.id)}
                />
              </CanAct>
            ) : null}
            {moment.deleted_at ? null : (
              <CanAct permission="moments.delete">
                <ConfirmAction
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Trash2 />
                      Remove
                    </Button>
                  }
                  title="Remove this moment?"
                  description="It disappears from the app straight away. The record stays here."
                  confirmLabel="Remove it"
                  onConfirm={() => onRemove(moment.id)}
                />
              </CanAct>
            )}
          </div>
        ),
      },
    ],
    [onRelease, onRemove]
  )

  return (
    <QueryTable
      query={query}
      what="moments"
      columns={columns}
      rowKey={(moment) => moment.id}
      empty="No moments match that."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
