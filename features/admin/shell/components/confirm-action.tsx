"use client"

import { useId, useState, type ReactElement, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { usePendingAction } from "../hooks/use-pending-action"

export interface ReasonField {
  label: string
  placeholder?: string
  required?: boolean
}

/**
 * Asks before doing something. Optionally collects a reason, or makes the admin type a phrase
 * (an email, a name) before the button unlocks. Closes only once `onConfirm` resolves, so a
 * failure leaves the dialog open with what was typed.
 */
export function ConfirmAction({
  trigger,
  title,
  description,
  confirmLabel,
  tone = "destructive",
  reason,
  typeToConfirm,
  disabled,
  onConfirm,
}: {
  trigger: ReactElement
  title: string
  description: ReactNode
  confirmLabel: string
  tone?: "destructive" | "default"
  reason?: ReasonField
  typeToConfirm?: string
  disabled?: boolean
  onConfirm: (reason: string | undefined) => Promise<unknown> | void
}) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState("")
  const [typed, setTyped] = useState("")
  const [pending, run] = usePendingAction(onConfirm)
  const id = useId()

  const trimmed = note.trim()
  const ready =
    (!reason?.required || trimmed !== "") &&
    (typeToConfirm === undefined || typed.trim() === typeToConfirm)

  async function confirm() {
    if (await run(trimmed || undefined)) setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!pending) setOpen(next)
      }}
      onOpenChangeComplete={(next) => {
        if (next) return
        setNote("")
        setTyped("")
      }}
    >
      <DialogTrigger render={trigger} disabled={disabled} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {reason ? (
          <Field>
            <FieldLabel htmlFor={`${id}-reason`}>
              {reason.required ? reason.label : `${reason.label} (optional)`}
            </FieldLabel>
            <Textarea
              id={`${id}-reason`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={reason.placeholder}
              rows={3}
              maxLength={500}
            />
          </Field>
        ) : null}
        {typeToConfirm !== undefined ? (
          <Field>
            <FieldLabel htmlFor={`${id}-typed`}>
              Type <span className="font-mono">{typeToConfirm}</span> to confirm
            </FieldLabel>
            <Input
              id={`${id}-typed`}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              autoComplete="off"
            />
          </Field>
        ) : null}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" disabled={pending} />}>
            Cancel
          </DialogClose>
          <Button
            variant={tone === "destructive" ? "destructive" : "default"}
            disabled={!ready || pending}
            onClick={confirm}
          >
            {pending ? <Spinner /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
