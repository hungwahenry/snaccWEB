"use client"

import { useState } from "react"
import { DataPagination } from "@/components/data-pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { formatDate, formatNumber } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import type { useSnaccMutations } from "./use-snaccs"
import type { AdminSnacc, ListSnaccsParams } from "./types"

type Mutations = ReturnType<typeof useSnaccMutations>

function DeleteDialog({ snacc, actions }: { snacc: AdminSnacc; actions: Mutations }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Remove
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove snacc</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Soft-deletes the snacc so it disappears from every feed. It can be restored later.
        </p>
        <Field>
          <FieldLabel>Reason (optional)</FieldLabel>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            maxLength={500}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={actions.remove.isPending}
            onClick={() =>
              actions.remove.mutate(
                { id: snacc.id, reason: reason.trim() || undefined },
                { onSuccess: () => setOpen(false) },
              )
            }
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SnaccActions({ snacc, actions }: { snacc: AdminSnacc; actions: Mutations }) {
  if (snacc.deleted_at) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={actions.restore.isPending}
        onClick={() => actions.restore.mutate(snacc.id)}
      >
        Restore
      </Button>
    )
  }
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        disabled={actions.pin.isPending || actions.unpin.isPending}
        onClick={() =>
          snacc.pinned ? actions.unpin.mutate(snacc.id) : actions.pin.mutate(snacc.id)
        }
      >
        {snacc.pinned ? "Unpin" : "Pin"}
      </Button>
      <DeleteDialog snacc={snacc} actions={actions} />
    </div>
  )
}

function preview(snacc: AdminSnacc) {
  if (snacc.body) return snacc.body
  if (snacc.images.length) return `${snacc.images.length} image(s)`
  if (snacc.gif) return "GIF"
  return "—"
}

export function SnaccsTable({
  data,
  params,
  onParams,
  actions,
}: {
  data: Paginated<AdminSnacc>
  params: ListSnaccsParams
  onParams: (patch: Partial<ListSnaccsParams>) => void
  actions: Mutations
}) {
  const [search, setSearch] = useState(params.q ?? "")
  const deletedValue =
    params.deleted === true ? "deleted" : params.deleted === false ? "live" : "all"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <form
          className="flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            onParams({ q: search.trim() || undefined, page: 1 })
          }}
        >
          <Input
            placeholder="Search snacc text…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-xs"
          />
        </form>
        <Select
          value={deletedValue}
          onValueChange={(value) =>
            onParams({
              deleted: !value || value === "all" ? undefined : value === "deleted",
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All snaccs</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="deleted">Removed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Content</TableHead>
            <TableHead className="text-right">Engagement</TableHead>
            <TableHead className="text-right">Reports</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-sm">
                No snaccs match these filters.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((snacc) => (
              <TableRow key={snacc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarImage src={snacc.author.avatar_url} alt="" />
                      <AvatarFallback>
                        {(snacc.author.display_name || snacc.author.username || "?")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {snacc.author.username ? `@${snacc.author.username}` : snacc.author.display_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate text-sm">{preview(snacc)}</p>
                  <p className="text-muted-foreground text-xs">{formatDate(snacc.created_at)}</p>
                </TableCell>
                <TableCell className="text-muted-foreground text-right text-xs tabular-nums">
                  {formatNumber(snacc.reactions_count)} rx · {formatNumber(snacc.comments_count)} co ·{" "}
                  {formatNumber(snacc.views_count)} vw
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {snacc.reports_count > 0 ? (
                    <Badge variant="destructive">{snacc.reports_count}</Badge>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell>
                  {snacc.deleted_at ? (
                    <Badge variant="destructive">removed</Badge>
                  ) : snacc.pinned ? (
                    <Badge variant="secondary">pinned</Badge>
                  ) : (
                    <Badge variant="outline">live</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <SnaccActions snacc={snacc} actions={actions} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DataPagination
        page={data.page}
        lastPage={data.last_page}
        total={data.total}
        onPage={(page) => onParams({ page })}
      />
    </div>
  )
}
