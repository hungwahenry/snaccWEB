"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
import {
  DataTable,
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { EmptyNote } from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { humanize } from "@/features/admin/shell/utils/format"
import type { AdminFeatureFlag, FlagDraft, FlagGroup } from "../types"
import {
  PLATFORM_LABELS,
  PLATFORMS,
  reachLabel,
  windowLabel,
} from "../utils/flags"
import { AvailabilityDialog } from "./availability-dialog"

function Reach({ flag }: { flag: AdminFeatureFlag }) {
  if (flag.overrides.length === 0) {
    const window = windowLabel(flag)

    return window ? (
      <Badge variant="outline" className="tabular-nums">
        {window}
      </Badge>
    ) : (
      <span className="text-xs text-muted-foreground">Every build</span>
    )
  }

  return (
    <dl className="flex flex-col gap-1">
      {PLATFORMS.map((platform) => {
        const label = reachLabel(flag, platform)

        return (
          <div key={platform} className="flex items-center gap-2">
            <dt className="w-14 shrink-0 text-xs text-muted-foreground">
              {PLATFORM_LABELS[platform]}
            </dt>
            <dd>
              <Badge
                variant={label === "Off" ? "secondary" : "outline"}
                className="tabular-nums"
              >
                {label}
              </Badge>
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

export function FlagsTables({
  groups,
  onSetEnabled,
  onSaveAvailability,
}: {
  groups: FlagGroup[]
  onSetEnabled: (key: string, enabled: boolean) => Promise<unknown>
  onSaveAvailability: (key: string, draft: FlagDraft) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminFeatureFlag>[]>(
    () => [
      {
        id: "flag",
        header: "Flag",
        className: "max-w-md whitespace-normal align-top",
        cell: (flag) => (
          <div className="min-w-0">
            <p className="font-mono text-xs">{flag.key}</p>
            <p className="mt-1 text-xs text-pretty text-muted-foreground">
              {flag.description}
            </p>
          </div>
        ),
      },
      {
        id: "reach",
        header: "Reaches",
        className: "align-top",
        cell: (flag) => <Reach flag={flag} />,
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        className: "align-top",
        cell: (flag) => (
          <div className="flex items-center justify-end gap-3">
            <CanAct permission="flags.write">
              <AvailabilityDialog
                flag={flag}
                trigger={
                  <Button variant="outline" size="sm">
                    Who gets it
                  </Button>
                }
                onSubmit={(draft) => onSaveAvailability(flag.key, draft)}
              />
            </CanAct>
            <CanAct permission="flags.write">
              <ActionSwitch
                checked={flag.enabled}
                label={`Turn ${flag.key} on or off`}
                onChange={(enabled) => onSetEnabled(flag.key, enabled)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [onSetEnabled, onSaveAvailability]
  )

  if (groups.length === 0) return <EmptyNote>No flags yet.</EmptyNote>

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <TableFrame key={group.category} title={humanize(group.category)}>
          <DataTable
            columns={columns}
            rows={group.flags}
            rowKey={(flag) => flag.key}
            empty="Nothing in this category."
          />
        </TableFrame>
      ))}
    </div>
  )
}
