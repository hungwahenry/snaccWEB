"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
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
import { formatNumber } from "@/lib/format"
import type { AdminEgg, EggDraft } from "../types"
import { eggStatus, RARITY_LABELS } from "../utils/egg"
import { EggArtDialog } from "./egg-art-dialog"
import { EggDialog } from "./egg-dialog"
import { EggMark } from "./egg-mark"

export function EggsTable({
  query,
  onSave,
  onDelete,
  onUploadArt,
  onRemoveArt,
}: {
  query: UseQueryResult<AdminEgg[]>
  onSave: (draft: EggDraft, id: string) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
  onUploadArt: (id: string, file: File) => Promise<unknown>
  onRemoveArt: (id: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminEgg>[]>(
    () => [
      {
        id: "egg",
        header: "Egg",
        cell: (egg) => (
          <div className="flex min-w-0 items-center gap-3">
            <EggMark egg={egg} className="size-6" />
            <div className="min-w-0">
              <p className="font-medium">{egg.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {egg.slug}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "rarity",
        header: "Rarity",
        cell: (egg) => (
          <Badge
            variant="outline"
            style={{ borderColor: egg.color, color: egg.color }}
          >
            {RARITY_LABELS[egg.rarity]}
          </Badge>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (egg) => (
          <div className="flex gap-1.5">
            <StatusBadge status={eggStatus(egg)} />
            {egg.seeded ? null : <Badge variant="outline">Added here</Badge>}
          </div>
        ),
      },
      {
        id: "found",
        header: "Found by",
        align: "end",
        className: "tabular-nums",
        cell: (egg) => formatNumber(egg.discoveries_count),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (egg) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="easter_eggs.write">
              <EggDialog
                egg={egg}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, egg.id)}
              />
            </CanAct>
            <CanAct permission="easter_eggs.write">
              <EggArtDialog
                egg={egg}
                trigger={
                  <Button variant="outline" size="sm">
                    Artwork
                  </Button>
                }
                onUpload={(file) => onUploadArt(egg.id, file)}
                onRemove={() => onRemoveArt(egg.id)}
              />
            </CanAct>
            {egg.seeded ? null : (
              <CanAct permission="easter_eggs.write">
                <ConfirmAction
                  trigger={
                    <Button variant="ghost" size="sm">
                      Delete
                    </Button>
                  }
                  title={`Delete ${egg.name}?`}
                  description="Everyone who found it loses it, its artwork is thrown away, and phones stop looking for it on their next refresh."
                  confirmLabel="Delete egg"
                  onConfirm={() => onDelete(egg.id)}
                />
              </CanAct>
            )}
          </div>
        ),
      },
    ],
    [onSave, onDelete, onUploadArt, onRemoveArt]
  )

  return (
    <QueryTable
      query={query}
      what="easter eggs"
      columns={columns}
      rowKey={(egg) => egg.id}
      empty="No eggs hidden yet."
    />
  )
}
