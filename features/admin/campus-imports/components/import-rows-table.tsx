"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import type { Option } from "@/features/admin/shell/types"
import type { Paginated } from "@/lib/api/types"
import type {
  CampusImportRow,
  CampusImportRowEdit,
  CampusImportSource,
} from "../types"
import {
  decisionChoices,
  MATCH,
  rowLine,
  rowPlace,
} from "../utils/campus-imports"
import { DecisionSelect } from "./decision-select"
import { RowDialog, type RowPlaces } from "./row-dialog"

export function ImportRowsTable({
  query,
  source,
  editable,
  places,
  campuses,
  toolbar,
  onPageChange,
  onEdit,
}: {
  query: UseQueryResult<Paginated<CampusImportRow>>
  source: CampusImportSource
  editable: boolean
  places: RowPlaces
  campuses: Option[]
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onEdit: (rowId: string, edit: CampusImportRowEdit) => Promise<unknown>
}) {
  const columns = useMemo<Column<CampusImportRow>[]>(
    () => [
      {
        id: "position",
        header: "#",
        className: "w-10 tabular-nums text-muted-foreground",
        cell: (row) => row.position,
      },
      {
        id: "campus",
        header: "Campus",
        className: "max-w-sm",
        cell: (row) => (
          <div className="min-w-0">
            <p className="font-medium">{row.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {rowLine(row)}
            </p>
            {row.notes.map((note) => (
              <p
                key={note}
                className="text-xs text-pretty text-muted-foreground italic"
              >
                {note}
              </p>
            ))}
          </div>
        ),
      },
      {
        id: "place",
        header: "Place",
        className: "text-muted-foreground",
        cell: (row) => rowPlace(row),
      },
      {
        id: "match",
        header: "Match",
        className: "max-w-56",
        cell: (row) => (
          <>
            <StatusBadge status={MATCH[row.match]} />
            {row.campus && source === "file" ? (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {row.campus.name}
              </p>
            ) : null}
            {row.merge_into ? (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                Copy of {row.merge_into.name}
              </p>
            ) : null}
          </>
        ),
      },
      {
        id: "decision",
        header: "Decision",
        cell: (row) => (
          <CanAct permission="universities.import">
            <DecisionSelect
              label={`What happens to row ${row.position}`}
              value={row.decision}
              options={decisionChoices(row, source)}
              disabled={!editable}
              onChange={(decision) => onEdit(row.id, { decision })}
            />
          </CanAct>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (row) => (
          <CanAct permission="universities.import">
            <RowDialog
              row={row}
              source={source}
              places={places}
              campuses={campuses}
              disabled={!editable}
              trigger={
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              }
              onSave={(edit) => onEdit(row.id, edit)}
            />
          </CanAct>
        ),
      },
    ],
    [source, editable, places, campuses, onEdit]
  )

  return (
    <QueryTable
      query={query}
      what="these campuses"
      columns={columns}
      rowKey={(row) => row.id}
      empty="No campuses match that."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
