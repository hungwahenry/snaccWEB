"use client"

import { Plus } from "lucide-react"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  DataTable,
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import type { AdminRegion, RegionInput } from "../types"
import { regionRows, usageNote, type RegionRow } from "../utils/places"
import { RegionDialog } from "./region-dialog"

export function RegionsTable({
  regions,
  onAdd,
  onSave,
  onRemove,
}: {
  regions: AdminRegion[]
  onAdd: (input: RegionInput) => Promise<unknown>
  onSave: (id: string, input: RegionInput) => Promise<unknown>
  onRemove: (id: string) => Promise<unknown>
}) {
  const rows = useMemo(() => regionRows(regions), [regions])
  const columns = useMemo<Column<RegionRow>[]>(
    () => [
      {
        id: "name",
        header: "Region",
        cell: ({ region, depth }) => (
          <span
            className={depth === 0 ? "font-medium" : undefined}
            style={{ paddingLeft: `${depth * 1.25}rem` }}
          >
            {region.name}
          </span>
        ),
      },
      {
        id: "use",
        header: "Used by",
        hideBelow: "sm",
        className: "text-sm text-muted-foreground",
        cell: ({ region }) => usageNote(region),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: ({ region }) => (
          <div className="flex justify-end gap-1">
            <CanAct permission="countries.write">
              <RegionDialog
                region={region}
                regions={regions}
                trigger={
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(input) => onSave(region.id, input)}
              />
            </CanAct>
            <CanAct permission="countries.write">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                title={`Delete ${region.name}?`}
                description="Only a region nothing uses can go: no campus, promotion or smaller region."
                confirmLabel="Delete it"
                onConfirm={() => onRemove(region.id)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [regions, onSave, onRemove]
  )

  return (
    <TableFrame
      title="Regions"
      description="Where a campus is, inside the country. Campus imports and promotion targeting use these."
      actions={
        <CanAct permission="countries.write">
          <RegionDialog
            regions={regions}
            trigger={
              <Button size="sm">
                <Plus />
                Add region
              </Button>
            }
            onSubmit={onAdd}
          />
        </CanAct>
      }
    >
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={({ region }) => region.id}
        empty="No regions yet. Add the country's states or provinces before importing its campuses."
      />
    </TableFrame>
  )
}
