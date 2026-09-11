"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { pagePath } from "@/features/admin/shell/routes"
import { formatDate } from "@/lib/format"
import type { AdminPage } from "../types"
import { PAGE_STATUS } from "../utils/page"

export function PagesTable({
  query,
  onDelete,
}: {
  query: UseQueryResult<AdminPage[]>
  onDelete: (id: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminPage>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        cell: (page) => (
          <div className="min-w-0">
            <p className="font-medium">{page.title}</p>
            <p className="font-mono text-xs text-muted-foreground">
              /{page.slug}
            </p>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (page) => <StatusBadge status={PAGE_STATUS[page.status]} />,
      },
      {
        id: "updated",
        header: "Updated",
        className: "text-muted-foreground",
        cell: (page) => formatDate(page.updated_at),
      },
      {
        id: "actions",
        header: "Actions",
        align: "end",
        cell: (page) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href={pagePath(page.id)} />}
            >
              Edit
            </Button>
            <CanAct permission="pages.delete">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                title="Delete this page?"
                description="Anyone following its link gets a 404 from the moment you confirm."
                confirmLabel="Delete page"
                onConfirm={() => onDelete(page.id)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [onDelete]
  )

  return (
    <QueryTable
      query={query}
      what="pages"
      columns={columns}
      rowKey={(page) => page.id}
      empty="No pages yet."
    />
  )
}
