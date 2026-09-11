"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { SelectField } from "@/features/admin/shell/components/form-fields"
import type { Option } from "@/features/admin/shell/types"

function CampusForm({
  currentId,
  campuses,
  onSubmit,
}: {
  currentId: string | null
  campuses: Option[]
  onSubmit: (universityId: string) => Promise<unknown>
}) {
  const [chosen, setChosen] = useState<string | null>(currentId)

  return (
    <DialogForm
      submitLabel="Move account"
      canSubmit={chosen !== null && chosen !== currentId}
      onSubmit={() => (chosen ? onSubmit(chosen) : undefined)}
    >
      <SelectField
        label="University"
        value={chosen}
        onChange={setChosen}
        options={campuses}
        placeholder={campuses.length ? "Pick a campus" : "Loading campuses…"}
      />
    </DialogForm>
  )
}

export function CampusDialog({
  currentId,
  campuses,
  trigger,
  disabled,
  onSubmit,
}: {
  currentId: string | null
  campuses: Option[]
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
      <CampusForm
        currentId={currentId}
        campuses={campuses}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
