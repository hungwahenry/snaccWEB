"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import {
  DataTable,
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { EmptyNote } from "@/features/admin/shell/components/detail"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { humanize } from "@/features/admin/shell/utils/format"
import type { AdminConfigSetting, ConfigDraft, ConfigGroup } from "../types"
import {
  CHANGED_STATUS,
  PRIVATE_STATUS,
  previewValue,
  PUBLIC_STATUS,
} from "../utils/config"
import { ConfigDialog } from "./config-dialog"

function ValuePreview({ value }: { value: unknown }) {
  const preview = previewValue(value)
  if (preview === null) {
    return <span className="text-xs text-muted-foreground italic">Empty</span>
  }

  return <code className="line-clamp-3 text-xs break-all">{preview}</code>
}

export function ConfigTables({
  groups,
  onSave,
}: {
  groups: ConfigGroup[]
  onSave: (setting: AdminConfigSetting, draft: ConfigDraft) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminConfigSetting>[]>(
    () => [
      {
        id: "setting",
        header: "Setting",
        className: "max-w-md whitespace-normal align-top",
        cell: (setting) => (
          <div className="min-w-0">
            <p className="font-mono text-xs">{setting.key}</p>
            <p className="mt-1 text-xs text-pretty text-muted-foreground">
              {setting.description}
            </p>
          </div>
        ),
      },
      {
        id: "value",
        header: "Value",
        className: "max-w-xs whitespace-normal align-top",
        cell: (setting) => <ValuePreview value={setting.value} />,
      },
      {
        id: "state",
        header: "State",
        className: "align-top",
        cell: (setting) => (
          <div className="flex flex-wrap gap-1">
            <StatusBadge
              status={setting.is_public ? PUBLIC_STATUS : PRIVATE_STATUS}
            />
            {setting.is_default ? null : (
              <StatusBadge status={CHANGED_STATUS} />
            )}
          </div>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        className: "align-top",
        cell: (setting) => (
          <CanAct permission="config.write">
            <ConfigDialog
              setting={setting}
              trigger={
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              }
              onSubmit={(draft) => onSave(setting, draft)}
            />
          </CanAct>
        ),
      },
    ],
    [onSave]
  )

  if (groups.length === 0) return <EmptyNote>No settings yet.</EmptyNote>

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <TableFrame key={group.category} title={humanize(group.category)}>
          <DataTable
            columns={columns}
            rows={group.settings}
            rowKey={(setting) => setting.key}
            empty="Nothing in this category."
          />
        </TableFrame>
      ))}
    </div>
  )
}
