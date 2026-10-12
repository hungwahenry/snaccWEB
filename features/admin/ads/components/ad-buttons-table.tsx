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
import type { AdButton, AdButtonDraft } from "../types"
import { AdButtonDialog } from "./ad-button-dialog"

export function AdButtonsTable({
  query,
  onSave,
  onSetRetired,
}: {
  query: UseQueryResult<AdButton[]>
  onSave: (draft: AdButtonDraft, id: string) => Promise<unknown>
  onSetRetired: (id: string, retired: boolean) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdButton>[]>(
    () => [
      {
        id: "label",
        header: "Label",
        cell: (button) => (
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 font-medium">
              {button.label}
              {button.retired ? <Badge variant="outline">Retired</Badge> : null}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {button.slug}
            </p>
          </div>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (button) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="ads.policy">
              <AdButtonDialog
                button={button}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, button.id)}
              />
            </CanAct>
            <CanAct permission="ads.policy">
              {button.retired ? (
                <ActionButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetRetired(button.id, false)}
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
                  title={`Retire ${button.label}?`}
                  description="Advertisers stop being offered it. Promotions already using it keep their button."
                  confirmLabel="Retire label"
                  onConfirm={() => onSetRetired(button.id, true)}
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
      what="button labels"
      columns={columns}
      rowKey={(button) => button.id}
      empty="No labels yet. Promotions can't have a button until there is one to pick."
    />
  )
}
