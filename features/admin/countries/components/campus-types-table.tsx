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
import type { AdminCampusType, CampusTypeInput } from "../types"
import { usageNote } from "../utils/places"
import { CampusTypeDialog } from "./campus-type-dialog"

export function CampusTypesTable({
  types,
  onAdd,
  onSave,
  onRemove,
}: {
  types: AdminCampusType[]
  onAdd: (input: CampusTypeInput) => Promise<unknown>
  onSave: (id: string, input: CampusTypeInput) => Promise<unknown>
  onRemove: (id: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminCampusType>[]>(
    () => [
      {
        id: "position",
        header: "#",
        className: "w-12 tabular-nums text-muted-foreground",
        cell: (type) => type.position,
      },
      {
        id: "name",
        header: "Campus type",
        className: "font-medium",
        cell: (type) => type.name,
      },
      {
        id: "use",
        header: "Used by",
        hideBelow: "sm",
        className: "text-sm text-muted-foreground",
        cell: (type) => usageNote(type),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (type) => (
          <div className="flex justify-end gap-1">
            <CanAct permission="countries.write">
              <CampusTypeDialog
                type={type}
                trigger={
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(input) => onSave(type.id, input)}
              />
            </CanAct>
            <CanAct permission="countries.write">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                title={`Delete ${type.name}?`}
                description="Only a campus type nothing uses can go: no campus or promotion."
                confirmLabel="Delete it"
                onConfirm={() => onRemove(type.id)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [onSave, onRemove]
  )

  return (
    <TableFrame
      title="Campus types"
      description="The kinds of campus this country has, like Federal, State and Private."
      actions={
        <CanAct permission="countries.write">
          <CampusTypeDialog
            trigger={
              <Button size="sm">
                <Plus />
                Add campus type
              </Button>
            }
            onSubmit={onAdd}
          />
        </CanAct>
      }
    >
      <DataTable
        columns={columns}
        rows={types}
        rowKey={(type) => type.id}
        empty="No campus types yet."
      />
    </TableFrame>
  )
}
