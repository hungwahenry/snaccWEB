"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { Ban, Check } from "lucide-react"
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
import { UserCell } from "@/features/admin/shell/components/user-cell"
import type { Paginated } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import type { AdminReferral } from "../types"
import { reasonLabel, REFERRAL_STATUS } from "../utils/status"

export function ReferralsTable({
  query,
  toolbar,
  onPageChange,
  onApprove,
  onVoid,
}: {
  query: UseQueryResult<Paginated<AdminReferral>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onApprove: (id: string) => Promise<unknown>
  onVoid: (id: string, reason: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminReferral>[]>(
    () => [
      {
        id: "referrer",
        header: "Inviter",
        cell: (row) => <UserCell user={row.referrer} />,
      },
      {
        id: "referee",
        header: "Friend",
        cell: (row) => (
          <UserCell
            user={row.referee}
            note={`Joined ${formatDate(row.referee.joined_at)}`}
          />
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (row) => (
          <div className="flex flex-col gap-1">
            <StatusBadge status={REFERRAL_STATUS[row.status]} />
            {row.reason ? (
              <span className="text-xs text-muted-foreground">
                {reasonLabel(row.reason)}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        id: "device",
        header: "From",
        cell: (row) => (
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>{row.platform ?? "—"}</span>
            <span className="max-w-40 truncate">{row.install_id ?? "—"}</span>
          </div>
        ),
      },
      {
        id: "claimed",
        header: "Claimed",
        className: "whitespace-nowrap",
        cell: (row) => formatDate(row.created_at),
      },
      {
        id: "paid",
        header: "Paid",
        className: "whitespace-nowrap",
        cell: (row) => formatDate(row.paid_at),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (row) => (
          <div className="flex justify-end gap-1">
            {row.status === "held" ? (
              <CanAct permission="referrals.review">
                <ConfirmAction
                  tone="default"
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Check />
                      Approve
                    </Button>
                  }
                  title="Approve this referral?"
                  description="It goes back in the queue and pays both sides with the next nightly sweep."
                  confirmLabel="Approve it"
                  onConfirm={() => onApprove(row.id)}
                />
              </CanAct>
            ) : null}
            {row.status === "void" ? null : (
              <CanAct permission="referrals.review">
                <ConfirmAction
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Ban />
                      Void
                    </Button>
                  }
                  title="Void this referral?"
                  description={
                    row.status === "paid"
                      ? "The score credit is taken back. Money already paid stays paid."
                      : "It will never pay. The record stays here."
                  }
                  confirmLabel="Void it"
                  reason={{ label: "Why", required: true }}
                  onConfirm={(reason) => onVoid(row.id, reason ?? "")}
                />
              </CanAct>
            )}
          </div>
        ),
      },
    ],
    [onApprove, onVoid]
  )

  return (
    <QueryTable
      query={query}
      what="referrals"
      columns={columns}
      rowKey={(row) => row.id}
      empty="No referrals match that."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
