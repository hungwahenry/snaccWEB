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
import { Checkbox } from "@/components/ui/checkbox"
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

const TARGET_NOUN = {
  snacc: "snacc",
  user: "user",
  message: "message",
  moment: "moment",
} as const

function actChoicesFor(target: AdminReport["target"]) {
  if (target?.type === "snacc")
    return [
      { value: "delete_snacc", label: "Remove the snacc" },
      { value: "suspend_author", label: "Suspend the author" },
    ]
  if (target?.type === "user")
    return [{ value: "suspend_user", label: "Suspend the user" }]
  if (target?.type === "message")
    return [
      { value: "delete_message", label: "Remove the message" },
      { value: "suspend_sender", label: "Suspend the sender" },
    ]
  if (target?.type === "moment")
    return [
      { value: "delete_moment", label: "Remove the moment" },
      { value: "suspend_moment_author", label: "Suspend whoever posted it" },
    ]
  return []
}

const SUSPEND_ACTS = [
  "suspend_user",
  "suspend_author",
  "suspend_sender",
  "suspend_moment_author",
]

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
  const [acts, setActs] = useState<string[]>([])
  const [draft, setDraft] = useState(EMPTY_SUSPENSION)

  const target = report.target
  const noun = target ? TARGET_NOUN[target.type] : "target"
  const actChoices = actChoicesFor(target)
  const threadId =
    target?.type === "message" ? target.message.conversation.id : null
  const suspending = acts.some((act) => SUSPEND_ACTS.includes(act))

  function toggleAct(value: string) {
    setActs((current) =>
      current.includes(value)
        ? current.filter((act) => act !== value)
        : [...current, value]
    )
  }

  function submit() {
    const input: ResolveReportInput = { status }
    if (target?.type === "snacc") input.snaccId = target.snacc.id
    else if (target?.type === "user") input.reportedUserId = target.user.id
    else if (target?.type === "message") input.messageId = target.message.id
    else if (target?.type === "moment") input.momentId = target.moment.id
    if (note.trim()) input.note = note.trim()
    if (acts.length > 0) input.acts = acts as ResolveReportInput["acts"]
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
        <p className="text-sm text-muted-foreground">
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
          <Select
            value={status}
            onValueChange={(value) => value && setStatus(value as never)}
          >
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
            <FieldLabel>Actions (optional)</FieldLabel>
            <div className="flex flex-col gap-1.5">
              {actChoices.map((choice) => (
                <button
                  key={choice.value}
                  type="button"
                  onClick={() => toggleAct(choice.value)}
                  className="flex items-center gap-2.5 text-left text-sm"
                >
                  <Checkbox
                    checked={acts.includes(choice.value)}
                    className="pointer-events-none"
                    tabIndex={-1}
                  />
                  {choice.label}
                </button>
              ))}
            </div>
          </Field>
        )}
        {suspending ? (
          <SuspensionFields value={draft} onChange={setDraft} />
        ) : null}
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
