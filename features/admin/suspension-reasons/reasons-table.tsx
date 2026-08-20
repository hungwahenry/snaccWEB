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
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SuspensionReason } from "./types"
import type { useSuspensionReasonMutations } from "./use-suspension-reasons"

type Mutations = ReturnType<typeof useSuspensionReasonMutations>

function ReasonDialog({
  reason,
  mutations,
  trigger,
}: {
  reason?: SuspensionReason
  mutations: Mutations
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [slug, setSlug] = useState(reason?.slug ?? "")
  const [title, setTitle] = useState(reason?.title ?? "Your account is suspended")
  const [description, setDescription] = useState(reason?.description ?? "")
  const [position, setPosition] = useState(String(reason?.position ?? 0))

  const editing = Boolean(reason)
  const valid = slug.trim() !== "" && title.trim() !== "" && description.trim() !== ""

  function save() {
    const base = {
      slug: slug.trim(),
      title: title.trim(),
      description: description.trim(),
      position: Number(position) || 0,
    }
    if (editing && reason) {
      mutations.update.mutate({ id: reason.id, input: base }, { onSuccess: () => setOpen(false) })
    } else {
      mutations.create.mutate(base, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit reason" : "New reason"}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-3">
          <Field className="w-44">
            <FieldLabel>Slug</FieldLabel>
            <Input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="harassment"
              maxLength={50}
            />
          </Field>
          <Field className="flex-1">
            <FieldLabel>Title</FieldLabel>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
            />
          </Field>
          <Field className="w-24">
            <FieldLabel>Position</FieldLabel>
            <Input
              type="number"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>What the user reads</FieldLabel>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={500}
          />
        </Field>
        <p className="text-muted-foreground text-xs">
          Write it to them, not about them. This is the only screen a suspended user can reach, so
          say what happened and what they can do next.
        </p>
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

export function SuspensionReasonsTable({
  reasons,
  mutations,
}: {
  reasons: SuspensionReason[]
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
            <TableHead>Slug</TableHead>
            <TableHead>What the user reads</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reasons.map((reason) => (
            <TableRow key={reason.id}>
              <TableCell className="font-medium">
                <span className="inline-flex items-center gap-2">
                  {reason.slug}
                  {reason.retired ? <Badge variant="outline">retired</Badge> : null}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-lg text-sm">
                {reason.description}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={mutations.update.isPending}
                    onClick={() =>
                      mutations.update.mutate({
                        id: reason.id,
                        input: { retired: !reason.retired },
                      })
                    }
                  >
                    {reason.retired ? "Restore" : "Retire"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
