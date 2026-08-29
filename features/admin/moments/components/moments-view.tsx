"use client"

import { ConfirmAction } from "@/components/admin/confirm-action"
import { Flag, Trash2, Undo2 } from "lucide-react"
import { useMemo } from "react"
import { DataTable, type Column } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { CanAct } from "@/components/rbac/can"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDate, formatNumber } from "@/lib/format"
import { queryOf, useListParams } from "@/lib/use-list-params"
import { UserCell } from "@/components/admin/user-cell"
import type { MomentRow } from "../types"
import { useMomentMutations, useMoments } from "../hooks/use-moments"

export function MomentsView() {
  const { params, set, setPage, reset, active } = useListParams<{
    held: string
    deleted: string
  }>({ held: "", deleted: "" })
  const query = useMoments(
    queryOf({
      page: params.page,
      perPage: 20,
      q: params.q,
      held: params.held,
      deleted: params.deleted,
    })
  )
  const mutations = useMomentMutations()

  const columns = useMemo<Column<MomentRow>[]>(
    () => [
      {
        id: "moment",
        header: "Moment",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.original.image_url}
                alt=""
                className="h-12 w-9 rounded object-cover"
              />
            ) : (
              <div
                className="flex h-12 w-9 items-center justify-center rounded text-[10px]"
                style={{
                  background: row.original.background ?? "var(--muted)",
                }}
              >
                Aa
              </div>
            )}
            <span className="line-clamp-2 max-w-sm text-sm">
              {row.original.body ?? "—"}
            </span>
          </div>
        ),
      },
      {
        id: "author",
        header: "Author",
        enableSorting: false,
        cell: ({ row }) => <UserCell user={row.original.author} />,
      },
      {
        accessorKey: "views_count",
        header: "Views",
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatNumber(row.original.views_count)}
          </span>
        ),
      },
      {
        id: "state",
        header: "State",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.deleted_at && (
              <Badge variant="destructive">Removed</Badge>
            )}
            {row.original.held_at && (
              <Badge variant="outline">
                <Flag className="size-3" />
                Held
              </Badge>
            )}
            {row.original.reports_count > 0 && (
              <Badge variant="secondary">
                {formatNumber(row.original.reports_count)} reports
              </Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Posted",
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap">
            {formatDate(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            {row.original.held_at && (
              <CanAct permission="moments.read">
                <ConfirmAction
                  label="Release"
                  icon={<Undo2 />}
                  variant="ghost"
                  title="Release this moment?"
                  description="It stops being held for review, so the next purge deletes it for good. Decide from what you can see now."
                  confirmLabel="Release it"
                  pending={mutations.release.isPending}
                  onConfirm={(close) =>
                    mutations.release.mutate(row.original.id, {
                      onSuccess: close,
                    })
                  }
                />
              </CanAct>
            )}
            {!row.original.deleted_at && (
              <CanAct permission="moments.delete">
                <ConfirmAction
                  label="Remove"
                  icon={<Trash2 />}
                  variant="ghost"
                  title="Remove this moment?"
                  description="It disappears from the app straight away. The record stays here."
                  confirmLabel="Remove it"
                  pending={mutations.remove.isPending}
                  onConfirm={(close) =>
                    mutations.remove.mutate(
                      { id: row.original.id },
                      { onSuccess: close }
                    )
                  }
                />
              </CanAct>
            )}
          </div>
        ),
      },
    ],
    [mutations]
  )

  return (
    <DataTable
      columns={columns}
      rows={query.data?.items}
      isPending={query.isPending}
      page={query.data?.page ?? params.page}
      perPage={query.data?.per_page ?? 20}
      total={query.data?.total ?? 0}
      onPageChange={setPage}
      empty="No moments match that."
      toolbar={
        <DataTableToolbar
          search={params.q}
          onSearchChange={(q) => set({ q })}
          placeholder="Caption text…"
          onReset={active ? reset : undefined}
          filters={
            <>
              <Select
                value={params.held || "any"}
                onValueChange={(value) =>
                  set({ held: value === "any" ? null : value })
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="true">Held by a report</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={params.deleted || "any"}
                onValueChange={(value) =>
                  set({ deleted: value === "any" ? null : value })
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">All</SelectItem>
                  <SelectItem value="false">Live</SelectItem>
                  <SelectItem value="true">Removed</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
        />
      }
    />
  )
}
