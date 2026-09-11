"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
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
import type { AdminReportReason, ReasonDraft } from "../types"
import { reasonStatus } from "../utils/report-reasons"
import { ReportReasonDialog } from "./report-reason-dialog"

export function ReasonsTable({
  query,
  onSave,
  onRetire,
  onRestore,
}: {
  query: UseQueryResult<AdminReportReason[]>
  onSave: (draft: ReasonDraft, id?: string) => Promise<unknown>
  onRetire: (id: string) => Promise<unknown>
  onRestore: (id: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminReportReason>[]>(
    () => [
      {
        id: "reason",
        header: "Reason",
        cell: (reason) => (
          <div className="min-w-0">
            <p className="font-medium">{reason.label}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {reason.slug}
            </p>
          </div>
        ),
      },
      {
        id: "applies",
        header: "Applies to",
        className: "text-sm capitalize",
        cell: (reason) => reason.applies_to,
      },
      {
        id: "detail",
        header: "Detail",
        className: "text-sm text-muted-foreground",
        cell: (reason) => (reason.requires_detail ? "Required" : "Optional"),
      },
      {
        id: "position",
        header: "Position",
        align: "end",
        className: "tabular-nums",
        cell: (reason) => reason.position,
      },
      {
        id: "status",
        header: "Status",
        cell: (reason) => <StatusBadge status={reasonStatus(reason)} />,
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (reason) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="report_reasons.write">
              <ReportReasonDialog
                reason={reason}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, reason.id)}
              />
            </CanAct>
            {reason.retired_at ? (
              <ActionButton
                variant="ghost"
                size="sm"
                onClick={() => onRestore(reason.id)}
              >
                Restore
              </ActionButton>
            ) : (
              <CanAct permission="report_reasons.retire">
                <ConfirmAction
                  trigger={
                    <Button variant="ghost" size="sm">
                      Retire
                    </Button>
                  }
                  title={`Retire "${reason.label}"?`}
                  description="Nobody can pick it when reporting any more. Reports already filed under it keep their reason."
                  confirmLabel="Retire it"
                  onConfirm={() => onRetire(reason.id)}
                />
              </CanAct>
            )}
          </div>
        ),
      },
    ],
    [onSave, onRetire, onRestore]
  )

  return (
    <QueryTable
      query={query}
      what="reasons"
      columns={columns}
      rowKey={(reason) => reason.id}
      empty="No report reasons yet."
      actions={
        <CanAct permission="report_reasons.write">
          <ReportReasonDialog
            trigger={<Button size="sm">Add reason</Button>}
            onSubmit={(draft) => onSave(draft)}
          />
        </CanAct>
      }
    />
  )
}
