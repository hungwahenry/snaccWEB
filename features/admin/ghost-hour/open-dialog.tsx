"use client"

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
import { Input } from "@/components/ui/input"

export function OpenDialog({
  defaultMinutes,
  pending,
  onOpen,
}: {
  defaultMinutes: number
  pending: boolean
  onOpen: (minutes: number | undefined, close: () => void) => void
}) {
  const [open, setOpen] = useState(false)
  const [minutes, setMinutes] = useState("")

  const parsed = Number(minutes)
  const value =
    minutes.trim() !== "" && Number.isFinite(parsed) && parsed > 0
      ? Math.round(parsed)
      : undefined

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">Open Ghost Hour now</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open Ghost Hour</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This broadcasts a push to{" "}
          <span className="font-medium text-foreground">every device</span> and
          turns on anonymous posting for the window.
        </p>
        <Field>
          <FieldLabel>Window length (minutes, optional)</FieldLabel>
          <Input
            type="number"
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
            placeholder={String(defaultMinutes)}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={pending}
            onClick={() => onOpen(value, () => setOpen(false))}
          >
            Open now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
