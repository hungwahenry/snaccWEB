"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { usePendingAction } from "@/features/admin/shell/hooks/use-pending-action"
import type {
  ModerationMode,
  ModerationSurface,
  SurfaceSetting,
} from "../types"
import { MODE_OPTIONS, surfaceLabel, surfaceState } from "../utils/surfaces"

function ModeSelect({
  value,
  label,
  disabled,
  onChange,
}: {
  value: ModerationMode
  label: string
  disabled?: boolean
  onChange: (mode: ModerationMode) => Promise<unknown>
}) {
  const [pending, run] = usePendingAction(onChange)

  return (
    <OptionSelect
      label={label}
      value={value}
      onChange={(mode) => {
        if (mode) void run(mode)
      }}
      options={MODE_OPTIONS}
      disabled={disabled || pending}
      className="w-36"
    />
  )
}

export function SurfacesTable({
  query,
  onSetEnabled,
  onSetMode,
}: {
  query: UseQueryResult<SurfaceSetting[]>
  onSetEnabled: (
    surface: ModerationSurface,
    enabled: boolean
  ) => Promise<unknown>
  onSetMode: (
    surface: ModerationSurface,
    mode: ModerationMode
  ) => Promise<unknown>
}) {
  const columns = useMemo<Column<SurfaceSetting>[]>(
    () => [
      {
        id: "surface",
        header: "Surface",
        className: "font-medium",
        cell: (row) => surfaceLabel(row.surface),
      },
      {
        id: "enabled",
        header: "Reviewed",
        cell: (row) => <StatusBadge status={surfaceState(row.enabled)} />,
      },
      {
        id: "mode",
        header: "When",
        cell: (row) => (
          <CanAct permission="moderation.write">
            <ModeSelect
              value={row.mode}
              label={`When ${surfaceLabel(row.surface)} are reviewed`}
              onChange={(mode) => onSetMode(row.surface, mode)}
            />
          </CanAct>
        ),
      },
      {
        id: "timeout",
        header: "Timeout",
        align: "end",
        className: "tabular-nums",
        cell: (row) => `${row.timeout_ms} ms`,
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (row) => (
          <CanAct permission="moderation.write">
            <ConfirmAction
              trigger={
                <Button variant="outline" size="sm">
                  {row.enabled ? "Turn off" : "Turn on"}
                </Button>
              }
              tone={row.enabled ? "destructive" : "default"}
              title={
                row.enabled
                  ? `Stop reviewing ${surfaceLabel(row.surface)}?`
                  : `Start reviewing ${surfaceLabel(row.surface)}?`
              }
              description={
                row.enabled
                  ? "Nothing on this surface is sent for review from now on. Existing holds stay as they are."
                  : "Content here starts being sent to the classifier. Whether anything is acted on still depends on the enforcement flag."
              }
              confirmLabel={row.enabled ? "Turn it off" : "Turn it on"}
              onConfirm={() => onSetEnabled(row.surface, !row.enabled)}
            />
          </CanAct>
        ),
      },
    ],
    [onSetEnabled, onSetMode]
  )

  return (
    <QueryTable
      query={query}
      what="surfaces"
      title="Surfaces"
      description="Which kinds of content are reviewed, and whether they are checked before the write. Inline is the only mode that can stop something reaching a feed."
      columns={columns}
      rowKey={(row) => row.surface}
      empty="No surfaces yet."
    />
  )
}
