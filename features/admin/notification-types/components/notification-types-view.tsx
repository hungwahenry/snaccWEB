"use client"

import { useMemo, useState } from "react"
import { DataTable, type Column } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { CanAct } from "@/components/rbac/can"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { NotificationTypeRow } from "../types"
import {
  useNotificationTypes,
  useUpdateNotificationType,
} from "../hooks/use-notification-types"

function describeWindow(minutes: number): string {
  if (minutes % 1440 === 0) {
    const days = minutes / 1440
    return days === 1 ? "a day" : `${days} days`
  }
  if (minutes % 60 === 0) {
    const hours = minutes / 60
    return hours === 1 ? "an hour" : `${hours} hours`
  }
  return `${minutes} min`
}

export function NotificationTypesView() {
  const query = useNotificationTypes()
  const update = useUpdateNotificationType()
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<NotificationTypeRow | null>(null)

  const rows = useMemo(() => {
    const all = query.data ?? []
    const needle = search.trim().toLowerCase()
    if (!needle) return all

    return all.filter(
      (row) =>
        row.key.toLowerCase().includes(needle) ||
        row.label.toLowerCase().includes(needle) ||
        row.body_template.toLowerCase().includes(needle)
    )
  }, [query.data, search])

  const columns = useMemo<Column<NotificationTypeRow>[]>(
    () => [
      {
        accessorKey: "label",
        header: "Notification",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="text-sm font-medium">{row.original.label}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.key}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "body_template",
        header: "What it says",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.body_template}
          </span>
        ),
      },
      {
        id: "delivery",
        header: "Delivery",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.default_push && (
              <Badge variant="secondary">Push</Badge>
            )}
            {row.original.instant_email ? (
              <Badge variant="secondary">Email now</Badge>
            ) : row.original.default_email ? (
              <Badge variant="outline">Digest</Badge>
            ) : null}
            {row.original.locked && <Badge variant="outline">Always on</Badge>}
          </div>
        ),
      },
      {
        id: "grouping",
        header: "Grouping",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.aggregates ? (
            <span className="text-sm text-muted-foreground">
              {row.original.group_window_minutes
                ? `folds for ${describeWindow(row.original.group_window_minutes)}`
                : "folds indefinitely"}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">one per event</span>
          ),
      },
      {
        id: "edit",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <CanAct permission="notification_types.write">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(row.original)}
            >
              Edit
            </Button>
          </CanAct>
        ),
      },
    ],
    []
  )

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        isPending={query.isPending}
        empty="No notifications match that."
        toolbar={
          <DataTableToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder="Key, label or wording…"
            onReset={search ? () => setSearch("") : undefined}
          />
        }
      />
      <EditDialog
        row={editing}
        onClose={() => setEditing(null)}
        onSave={(patch) => {
          if (!editing) return
          update.mutate(
            { key: editing.key, patch },
            { onSuccess: () => setEditing(null) }
          )
        }}
        saving={update.isPending}
      />
    </>
  )
}

function EditDialog({
  row,
  onClose,
  onSave,
  saving,
}: {
  row: NotificationTypeRow | null
  onClose: () => void
  onSave: (patch: Record<string, unknown>) => void
  saving: boolean
}) {
  const [label, setLabel] = useState("")
  const [body, setBody] = useState("")
  const [detail, setDetail] = useState("")
  const [push, setPush] = useState(false)
  const [email, setEmail] = useState(false)
  const [instant, setInstant] = useState(false)
  const [window, setWindow] = useState("")

  const key = row?.key ?? null
  const [loadedFor, setLoadedFor] = useState<string | null>(null)
  if (row && loadedFor !== key) {
    setLoadedFor(key)
    setLabel(row.label)
    setBody(row.body_template)
    setDetail(row.detail_template ?? "")
    setPush(row.default_push)
    setEmail(row.default_email)
    setInstant(row.instant_email)
    setWindow(String(row.group_window_minutes ?? ""))
  }

  return (
    <Dialog open={row !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{row?.label}</DialogTitle>
          <DialogDescription>
            Wording supports placeholders like {"{actor}"} and{" "}
            {"{amount|naira}"}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="body">Body</Label>
            <Input
              id="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="detail">Detail</Label>
            <Input
              id="detail"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
            />
          </div>
          {row?.aggregates && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="window">Group window (minutes)</Label>
              <Input
                id="window"
                inputMode="numeric"
                placeholder="Blank groups indefinitely"
                value={window}
                onChange={(event) => setWindow(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                How long one row keeps absorbing new events before a fresh one
                starts. Without a window a single row grows for the life of the
                account.
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Toggle label="Push by default" checked={push} onChange={setPush} />
            {row?.emailable && (
              <>
                <Toggle
                  label="Email by default"
                  checked={email}
                  onChange={setEmail}
                />
                <Toggle
                  label="Email the moment it happens"
                  checked={instant}
                  onChange={setInstant}
                />
              </>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={saving}
            onClick={() =>
              onSave({
                label,
                bodyTemplate: body,
                detailTemplate: detail,
                defaultPush: push,
                defaultEmail: email,
                instantEmail: instant,
                groupWindowMinutes: Number(window) || 0,
              })
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
