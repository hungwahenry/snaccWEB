"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import type { Option } from "@/features/admin/shell/types"
import { SuspensionFields } from "@/features/admin/suspension-reasons/components/suspension-fields"
import type {
  SuspensionDraft,
  SuspensionReason,
} from "@/features/admin/suspension-reasons/types"
import { EMPTY_SUSPENSION } from "@/features/admin/suspension-reasons/utils/suspension"

function SuspendForm({
  reasons,
  durations,
  onSubmit,
}: {
  reasons: SuspensionReason[]
  durations: Option[]
  onSubmit: (draft: SuspensionDraft, note: string) => Promise<unknown>
}) {
  const [draft, setDraft] = useState(EMPTY_SUSPENSION)
  const [note, setNote] = useState("")

  return (
    <DialogForm
      submitLabel="Suspend"
      tone="destructive"
      onSubmit={() => onSubmit(draft, note)}
    >
      <SuspensionFields
        value={draft}
        onChange={setDraft}
        reasons={reasons}
        durations={durations}
      />
      <TextField
        label="Note for other admins"
        optional
        multiline
        rows={2}
        maxLength={500}
        placeholder="Never shown to them."
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
    </DialogForm>
  )
}

export function SuspendDialog({
  reasons,
  durations,
  trigger,
  disabled,
  onSubmit,
}: {
  reasons: SuspensionReason[]
  durations: Option[]
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: SuspensionDraft, note: string) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Suspend this account"
      description="They stay signed in but can only reach the screen explaining why. A suspension with an end date lifts itself."
    >
      <SuspendForm
        reasons={reasons}
        durations={durations}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
