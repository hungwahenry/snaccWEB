"use client"

import Link from "next/link"
import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  EMPTY_SUSPENSION,
  SuspensionFields,
  toSuspensionInput,
} from "@/features/admin/suspension-reasons/suspension-fields"
import type { useResolveReport } from "./use-reports"
import type { AdminReport, ResolveReportInput } from "./types"

const TARGET_NOUN = { snacc: "snacc", user: "user", message: "message" } as const

function actChoicesFor(target: AdminReport["target"]) {
  if (target?.type === "snacc") return [{ value: "delete_snacc", label: "Remove the snacc" }]
  if (target?.type === "user") return [{ value: "suspend_user", label: "Suspend the user" }]
  if (target?.type === "message")
    return [
      { value: "delete_message", label: "Remove the message" },
      { value: "suspend_sender", label: "Suspend the sender" },
    ]
  return []
}

export function ResolveDialog({
  report,
  resolve,
}: {
  report: AdminReport
  resolve: ReturnType<typeof useResolveReport>
}) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"actioned" | "dismissed">("actioned")
  const [note, setNote] = useState("")
  const [act, setAct] = useState<string>("none")
  const [draft, setDraft] = useState(EMPTY_SUSPENSION)

  const target = report.target
  const noun = target ? TARGET_NOUN[target.type] : "target"
  const actChoices = actChoicesFor(target)
  const threadId = target?.type === "message" ? target.message.conversation.id : null
  const suspending = act === "suspend_user" || act === "suspend_sender"

  function submit() {
    const input: ResolveReportInput = { status }
    if (target?.type === "snacc") input.snaccId = target.snacc.id
    else if (target?.type === "user") input.reportedUserId = target.user.id
    else if (target?.type === "message") input.messageId = target.message.id
    if (note.trim()) input.note = note.trim()
    if (act !== "none") input.act = act as ResolveReportInput["act"]
    if (suspending) input.suspension = toSuspensionInput(draft)
    resolve.mutate(input, { onSuccess: () => setOpen(false) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Resolve
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve reports</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Resolves every open report on this {noun} together.
        </p>
        {threadId ? (
          <Link
            href={`/admin/messages/${threadId}`}
            className="text-sm font-medium underline underline-offset-4"
          >
            View the full thread →
          </Link>
        ) : null}
        <Field>
          <FieldLabel>Outcome</FieldLabel>
          <Select value={status} onValueChange={(value) => value && setStatus(value as never)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actioned">Actioned</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        {actChoices.length > 0 && (
          <Field>
            <FieldLabel>Action (optional)</FieldLabel>
            <Select value={act} onValueChange={(value) => setAct(value || "none")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Resolve only</SelectItem>
                {actChoices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        {suspending ? <SuspensionFields value={draft} onChange={setDraft} /> : null}
        <Field>
          <FieldLabel>Note (optional)</FieldLabel>
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            maxLength={500}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button disabled={resolve.isPending} onClick={submit}>
            Resolve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
