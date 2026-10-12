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
import type { AdReason, AdReasonDraft } from "../types"
import { AdReasonDialog } from "./ad-reason-dialog"

export function AdReasonsTable({
  query,
  onSave,
  onSetRetired,
}: {
  query: UseQueryResult<AdReason[]>
  onSave: (draft: AdReasonDraft, id: string) => Promise<unknown>
  onSetRetired: (id: string, retired: boolean) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdReason>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        cell: (reason) => (
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 font-medium">
              {reason.label}
              {reason.prohibited ? (
                <Badge variant="secondary">Not allowed</Badge>
              ) : null}
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
          <p className="text-sm text-pretty text-muted-foreground">
            {reason.description}
          </p>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (reason) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="ads.policy">
              <AdReasonDialog
                reason={reason}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, reason.id)}
              />
            </CanAct>
            <CanAct permission="ads.policy">
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
                  description="Reviewers stop being offered it and advertisers stop seeing it listed. Promotions already turned down for it keep the wording they were shown."
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
      what="ad rejection reasons"
      columns={columns}
      rowKey={(reason) => reason.id}
      empty="No reasons yet. A promotion can't be turned down until there is one to pick."
    />
  )
}
