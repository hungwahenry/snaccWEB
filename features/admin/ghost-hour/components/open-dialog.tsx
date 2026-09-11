"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { parseWindowMinutes, WINDOW_MINUTES_INVALID } from "../utils/ghost-hour"

function OpenForm({
  defaultMinutes,
  onOpen,
}: {
  defaultMinutes: number
  onOpen: (minutes: number | undefined) => Promise<unknown>
}) {
  const [minutes, setMinutes] = useState("")
  const length = parseWindowMinutes(minutes)

  return (
    <DialogForm
      submitLabel="Open now"
      canSubmit={length.ok}
      onSubmit={() => (length.ok ? onOpen(length.minutes) : undefined)}
    >
      <TextField
        label="Window length in minutes"
        optional
        inputMode="numeric"
        placeholder={String(defaultMinutes)}
        value={minutes}
        onChange={(event) => setMinutes(event.target.value)}
        hint={
          length.ok ? null : (
            <span className="text-destructive">{WINDOW_MINUTES_INVALID}</span>
          )
        }
      />
    </DialogForm>
  )
}

export function OpenDialog({
  defaultMinutes,
  trigger,
  onOpen,
}: {
  defaultMinutes: number
  trigger: ReactElement
  onOpen: (minutes: number | undefined) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      title="Open Ghost Hour"
      description={
        <>
          This broadcasts a push to{" "}
          <span className="font-medium text-foreground">every device</span> and
          turns on anonymous posting for the window.
        </>
      }
    >
      <OpenForm defaultMinutes={defaultMinutes} onOpen={onOpen} />
    </FormDialog>
  )
}
