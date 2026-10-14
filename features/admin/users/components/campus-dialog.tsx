"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { CampusSearchField } from "@/features/admin/universities/containers/campus-search-field"

function CampusForm({
  currentId,
  onSubmit,
}: {
  currentId: string | null
  onSubmit: (universityId: string) => Promise<unknown>
}) {
  const [chosen, setChosen] = useState<string | null>(currentId)

  return (
    <DialogForm
      submitLabel="Move account"
      canSubmit={chosen !== null && chosen !== currentId}
      onSubmit={() => (chosen ? onSubmit(chosen) : undefined)}
    >
      <CampusSearchField
        label="Campus"
        value={chosen}
        onChange={setChosen}
      />
    </DialogForm>
  )
}

export function CampusDialog({
  currentId,
  trigger,
  disabled,
  onSubmit,
}: {
  currentId: string | null
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (universityId: string) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Change campus"
      description="Moves this account to another university. Snaccs they already posted stay on the campus they were posted from."
    >
      <CampusForm currentId={currentId} onSubmit={onSubmit} />
    </FormDialog>
  )
}
