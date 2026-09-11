"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
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
import type { SuspensionReason, SuspensionReasonDraft } from "../types"
import { SuspensionReasonDialog } from "./suspension-reason-dialog"

export function SuspensionReasonsTable({
  query,
  onSave,
  onSetRetired,
}: {
  query: UseQueryResult<SuspensionReason[]>
  onSave: (draft: SuspensionReasonDraft, id: string) => Promise<unknown>
  onSetRetired: (id: string, retired: boolean) => Promise<unknown>
}) {
  const columns = useMemo<Column<SuspensionReason>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        cell: (reason) => (
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-medium">
              {reason.label}
              {reason.retired ? <Badge variant="outline">Retired</Badge> : null}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {reason.slug}
            </p>
          </div>
        ),
      },
      {
        id: "wording",
        header: "What they read",
        className: "max-w-lg whitespace-normal",
        cell: (reason) => (
          <div className="text-sm">
            <p className="font-medium">{reason.title}</p>
            <p className="text-pretty text-muted-foreground">
              {reason.description}
            </p>
          </div>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (reason) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="suspension_reasons.write">
              <SuspensionReasonDialog
                reason={reason}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, reason.id)}
              />
            </CanAct>
            <CanAct permission="suspension_reasons.write">
              {reason.retired ? (
                <ActionButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetRetired(reason.id, false)}
                >
                  Restore
                </ActionButton>
              ) : (
                <ConfirmAction
                  trigger={
                    <Button variant="ghost" size="sm">
                      Retire
                    </Button>
                  }
                  title={`Retire ${reason.label}?`}
                  description="Moderators stop being offered it. People already suspended for it keep the wording they were shown."
                  confirmLabel="Retire reason"
                  onConfirm={() => onSetRetired(reason.id, true)}
                />
              )}
            </CanAct>
          </div>
        ),
      },
    ],
    [onSave, onSetRetired]
  )

  return (
    <QueryTable
      query={query}
      what="suspension reasons"
      columns={columns}
      rowKey={(reason) => reason.id}
      empty="No suspension reasons yet. Without one, a suspended person gets generic wording."
    />
  )
}
