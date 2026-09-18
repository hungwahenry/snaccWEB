"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { userPath } from "@/features/admin/shell/routes"
import { userName } from "@/features/admin/shell/utils/user"
import type { Paginated } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import type { AdminSubscriber } from "../types"
import {
  GRANT_DAYS,
  subscriberStanding,
  subscriberStore,
  untilLabel,
} from "../utils/premium"

export function SubscribersTable({
  query,
  toolbar,
  onPageChange,
  onGrant,
  onRevoke,
}: {
  query: UseQueryResult<Paginated<AdminSubscriber>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onGrant: (userId: string) => Promise<unknown>
  onRevoke: (userId: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminSubscriber>[]>(
    () => [
      {
        id: "who",
        header: "Who",
        cell: (row) => (
          <Link
            href={userPath(row.user.id)}
            className="font-medium underline-offset-4 hover:underline"
          >
            {userName(row.user)}
          </Link>
        ),
      },
      {
        id: "store",
        header: "Store",
        cell: (row) => subscriberStore(row),
      },
      {
        id: "plan",
        header: "Plan",
        className: "text-muted-foreground",
        cell: (row) => row.product_id,
      },
      {
        id: "standing",
        header: "Standing",
        cell: (row) => <StatusBadge status={subscriberStanding(row)} />,
      },
      {
        id: "until",
        header: "Until",
        className: "tabular-nums",
        cell: (row) => (
          <span className={cn(!row.expires_at && "text-muted-foreground")}>
            {untilLabel(row.expires_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (row) => (
          <CanAct permission="premium.write">
            {row.active ? (
              <ConfirmAction
                trigger={
                  <Button variant="outline" size="sm">
                    End
                  </Button>
                }
                title="End this subscription now?"
                description="Access stops immediately, rather than running to the end of the period they paid for. The store is not refunded by this — do that in the store's own console."
                confirmLabel="End it"
                onConfirm={() => onRevoke(row.user.id)}
              />
            ) : (
              <ConfirmAction
                trigger={
                  <Button variant="outline" size="sm">
                    Grant {GRANT_DAYS} days
                  </Button>
                }
                tone="default"
                title={`Give this account ${GRANT_DAYS} days?`}
                description="Writes a promotional subscription. It does not renew, and it is never counted as revenue."
                confirmLabel="Grant"
                onConfirm={() => onGrant(row.user.id)}
              />
            )}
          </CanAct>
        ),
      },
    ],
    [onGrant, onRevoke]
  )

  return (
    <QueryTable
      query={query}
      what="subscribers"
      title="Subscribers"
      description="Granting Premium here writes a promotional subscription, so it never shows up as revenue. Ending one takes access away immediately rather than at the end of the period."
      columns={columns}
      rowKey={(row) => row.id}
      empty="Nobody yet."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
