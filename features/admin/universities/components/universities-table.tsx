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
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { formatNaira, formatNumber } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import type { AdminUniversity, UniversityDraft } from "../types"
import { addedBy, CAMPUS_STATUS } from "../utils/status"
import { universityPlace } from "../utils/university"
import { MergeDialog } from "./merge-dialog"
import { UniversityDialog } from "./university-dialog"

export function UniversitiesTable({
  query,
  toolbar,
  onPageChange,
  onSave,
  onDelete,
  onVerify,
  onReject,
  onMerge,
  campuses,
}: {
  query: UseQueryResult<Paginated<AdminUniversity>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onSave: (draft: UniversityDraft, id: string) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
  onVerify: (draft: UniversityDraft, id: string) => Promise<unknown>
  onReject: (id: string) => Promise<unknown>
  onMerge: (id: string, intoId: string) => Promise<unknown>
  campuses: AdminUniversity[]
}) {
  const columns = useMemo<Column<AdminUniversity>[]>(
    () => [
      {
        id: "university",
        header: "University",
        cell: (university) => (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium">{university.name}</p>
              {university.status === "verified" ? null : (
                <StatusBadge status={CAMPUS_STATUS[university.status]} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {university.acronym} · {university.slug}
            </p>
            {addedBy(university) ? (
              <p className="text-xs text-muted-foreground">
                {addedBy(university)}
              </p>
            ) : null}
          </div>
        ),
      },
      {
        id: "place",
        header: "Place",
        className: "text-muted-foreground",
        cell: (university) => universityPlace(university),
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
            {university.status === "pending" ? (
              <>
                <CanAct permission="universities.write">
                  <UniversityDialog
                    university={university}
                    reviewing
                    trigger={<Button size="sm">Review</Button>}
                    onSubmit={(draft) => onVerify(draft, university.id)}
                  />
                </CanAct>
                <CanAct permission="universities.write">
                  <ConfirmAction
                    trigger={
                      <Button variant="outline" size="sm">
                        Turn down
                      </Button>
                    }
                    title={`Turn down ${university.name}?`}
                    description="Use this when it isn't a real campus. Everyone waiting on it gets an email asking them to pick their campus again, and nobody can add this name again."
                    confirmLabel="Turn down"
                    onConfirm={() => onReject(university.id)}
                  />
                </CanAct>
              </>
            ) : (
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
            )}
            <CanAct permission="universities.merge">
              <MergeDialog
                campus={university}
                campuses={campuses}
                trigger={
                  <Button variant="ghost" size="sm">
                    Merge
                  </Button>
                }
                onMerge={(intoId) => onMerge(university.id, intoId)}
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
    [onSave, onDelete, onVerify, onReject, onMerge, campuses]
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
