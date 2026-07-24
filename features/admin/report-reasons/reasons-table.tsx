"use client"

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { useReasonMutations } from "./use-report-reasons"
import type { AdminReportReason } from "./types"

type Mutations = ReturnType<typeof useReasonMutations>

function ReasonDialog({
  reason,
  mutations,
  trigger,
}: {
  reason?: AdminReportReason
  mutations: Mutations
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [slug, setSlug] = useState(reason?.slug ?? "")
  const [label, setLabel] = useState(reason?.label ?? "")
  const [hint, setHint] = useState(reason?.hint ?? "")
  const [appliesTo, setAppliesTo] = useState<"snacc" | "user">(reason?.applies_to ?? "snacc")
  const [requiresDetail, setRequiresDetail] = useState(reason?.requires_detail ?? false)
  const [position, setPosition] = useState(String(reason?.position ?? 0))

  const editing = Boolean(reason)
  const valid = editing
    ? label.trim() !== ""
    : slug.trim() !== "" && label.trim() !== ""

  function save() {
    const base = {
      label: label.trim(),
      hint: hint.trim() || undefined,
      appliesTo,
      requiresDetail,
      position: Number(position) || 0,
    }
    if (editing && reason) {
      mutations.update.mutate({ id: reason.id, input: base }, { onSuccess: () => setOpen(false) })
    } else {
      mutations.create.mutate({ slug: slug.trim(), ...base }, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit reason" : "New report reason"}</DialogTitle>
        </DialogHeader>
        {!editing && (
          <Field>
            <FieldLabel>Slug</FieldLabel>
            <Input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="spam"
              maxLength={50}
            />
          </Field>
        )}
        <Field>
          <FieldLabel>Label</FieldLabel>
          <Input value={label} onChange={(event) => setLabel(event.target.value)} maxLength={100} />
        </Field>
        <Field>
          <FieldLabel>Hint (optional)</FieldLabel>
          <Input value={hint} onChange={(event) => setHint(event.target.value)} maxLength={200} />
        </Field>
        <div className="flex gap-3">
          <Field className="flex-1">
            <FieldLabel>Applies to</FieldLabel>
            <Select value={appliesTo} onValueChange={(value) => value && setAppliesTo(value as never)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="snacc">Snacc</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field className="w-28">
            <FieldLabel>Position</FieldLabel>
            <Input
              type="number"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </Field>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Requires a written detail</span>
          <Switch checked={requiresDetail} onCheckedChange={setRequiresDetail} />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={!valid || mutations.create.isPending || mutations.update.isPending}
            onClick={save}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ReasonsTable({
  reasons,
  mutations,
}: {
  reasons: AdminReportReason[]
  mutations: Mutations
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ReasonDialog mutations={mutations} trigger={<Button size="sm">Add reason</Button>} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reason</TableHead>
            <TableHead>Applies to</TableHead>
            <TableHead>Detail</TableHead>
            <TableHead className="text-right">Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reasons.map((reason) => (
            <TableRow key={reason.id}>
              <TableCell>
                <div className="font-medium">{reason.label}</div>
                <div className="text-muted-foreground font-mono text-xs">{reason.slug}</div>
              </TableCell>
              <TableCell className="text-sm capitalize">{reason.applies_to}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {reason.requires_detail ? "Required" : "Optional"}
              </TableCell>
              <TableCell className="text-right tabular-nums">{reason.position}</TableCell>
              <TableCell>
                {reason.retired_at ? (
                  <Badge variant="outline">retired</Badge>
                ) : (
                  <Badge variant="secondary">active</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <ReasonDialog
                    reason={reason}
                    mutations={mutations}
                    trigger={
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  {reason.retired_at ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={mutations.unretire.isPending}
                      onClick={() => mutations.unretire.mutate(reason.id)}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={mutations.retire.isPending}
                      onClick={() => mutations.retire.mutate(reason.id)}
                    >
                      Retire
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
