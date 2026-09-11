"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { formatNaira, formatNumber } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import type { AdminUniversity, UniversityDraft } from "../types"
import { UniversityDialog } from "./university-dialog"

export function UniversitiesTable({
  query,
  toolbar,
  onPageChange,
  onSave,
  onDelete,
}: {
  query: UseQueryResult<Paginated<AdminUniversity>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onSave: (draft: UniversityDraft, id: string) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminUniversity>[]>(
    () => [
      {
        id: "university",
        header: "University",
        cell: (university) => (
          <div className="min-w-0">
            <p className="font-medium">{university.name}</p>
            <p className="text-xs text-muted-foreground">
              {university.acronym} · {university.slug}
            </p>
          </div>
        ),
      },
      {
        id: "members",
        header: "Members",
        align: "end",
        className: "tabular-nums",
        cell: (university) => formatNumber(university.stats.profiles),
      },
      {
        id: "snaccs",
        header: "Snaccs",
        align: "end",
        className: "tabular-nums",
        cell: (university) => formatNumber(university.stats.snaccs),
      },
      {
        id: "fund",
        header: "Fund",
        cell: (university) =>
          university.fund ? (
            <Badge variant="secondary">
              {formatNaira(university.fund.cap)} cap
            </Badge>
          ) : (
            <Badge variant="outline">Unpaid</Badge>
          ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (university) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="universities.write">
              <UniversityDialog
                university={university}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, university.id)}
              />
            </CanAct>
            <CanAct permission="universities.delete">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                title={`Delete ${university.name}?`}
                description="This only works for a campus nobody has posted from. Anyone who belongs to it loses their campus, and its fund, room and announcements go with it."
                confirmLabel="Delete university"
                onConfirm={() => onDelete(university.id)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [onSave, onDelete]
  )

  return (
    <QueryTable
      query={query}
      what="universities"
      columns={columns}
      rowKey={(university) => university.id}
      empty="No universities match that."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
