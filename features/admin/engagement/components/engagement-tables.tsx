"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  DataTable,
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { EmptyNote } from "@/features/admin/shell/components/detail"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import type {
  AdminEngagementKind,
  EngagementDraft,
  EngagementGroup,
} from "../types"
import {
  CHANGED_STATUS,
  OFF_STATUS,
  shippedSummary,
  weightLabel,
} from "../utils/engagement"
import { RepriceDialog } from "./reprice-dialog"

const NUMBER_CLASS = "w-24 align-top tabular-nums"

export function EngagementTables({
  groups,
  onReprice,
  onReset,
  onSetEnabled,
}: {
  groups: EngagementGroup[]
  onReprice: (key: string, draft: EngagementDraft) => Promise<unknown>
  onReset: (key: string) => Promise<unknown>
  onSetEnabled: (key: string, enabled: boolean) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminEngagementKind>[]>(
    () => [
      {
        id: "act",
        header: "Act",
        className: "max-w-md whitespace-normal align-top",
        cell: (kind) => (
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{kind.label}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {kind.key}
              </span>
              {kind.is_default ? null : <StatusBadge status={CHANGED_STATUS} />}
              {kind.enabled ? null : <StatusBadge status={OFF_STATUS} />}
            </div>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">
              {kind.description}
            </p>
          </div>
        ),
      },
      {
        id: "score",
        header: "Score",
        align: "end",
        className: NUMBER_CLASS,
        cell: (kind) => weightLabel(kind.score_weight),
      },
      {
        id: "feed",
        header: "Feed",
        align: "end",
        className: NUMBER_CLASS,
        cell: (kind) => weightLabel(kind.feed_weight),
      },
      {
        id: "kobo",
        header: "Kobo",
        align: "end",
        className: NUMBER_CLASS,
        cell: (kind) => weightLabel(kind.earn_kobo),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        className: "align-top",
        cell: (kind) => (
          <div className="flex items-center justify-end gap-2">
            {kind.is_default ? null : (
              <CanAct permission="engagement.write">
                <ConfirmAction
                  tone="default"
                  trigger={
                    <Button variant="ghost" size="sm">
                      Reset
                    </Button>
                  }
                  title={`Reset ${kind.label}?`}
                  description={`This puts back the weights Snacc ships with: ${shippedSummary(kind)}. It prices new engagement only, so nobody's score or balance changes, and it stays ${kind.enabled ? "on" : "off"}.`}
                  confirmLabel="Reset weights"
                  onConfirm={() => onReset(kind.key)}
                />
              </CanAct>
            )}
            <CanAct permission="engagement.write">
              <RepriceDialog
                kind={kind}
                trigger={
                  <Button variant="outline" size="sm">
                    Reprice
                  </Button>
                }
                onSubmit={(draft) => onReprice(kind.key, draft)}
              />
            </CanAct>
            <CanAct permission="engagement.write">
              <ActionSwitch
                checked={kind.enabled}
                label={`Count ${kind.label}`}
                onChange={(enabled) => onSetEnabled(kind.key, enabled)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [onReprice, onReset, onSetEnabled]
  )

  if (groups.length === 0) {
    return <EmptyNote>Nothing in the catalog yet.</EmptyNote>
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <TableFrame
          key={group.source}
          title={group.title}
          description={group.description}
        >
          <DataTable
            columns={columns}
            rows={group.kinds}
            rowKey={(kind) => kind.key}
            empty="Nothing here."
          />
        </TableFrame>
      ))}
    </div>
  )
}
