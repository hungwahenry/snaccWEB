"use client"

import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminCampusType, CampusTypeInput } from "../types"
import { toCampusTypeInput, typeDraftFrom } from "../utils/places"

function CampusTypeForm({
  type,
  onSubmit,
}: {
  type?: AdminCampusType
  onSubmit: (input: CampusTypeInput) => Promise<unknown>
}) {
  const { draft, text } = useDraft(() => typeDraftFrom(type))
  const input = toCampusTypeInput(draft)

  return (
    <DialogForm
      submitLabel={type ? "Save" : "Add campus type"}
      canSubmit={input !== null}
      onSubmit={() => (input ? onSubmit(input) : undefined)}
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
        <TextField
          label="Name"
          placeholder="Polytechnic"
          maxLength={60}
          {...text("name")}
        />
        <TextField
          label="Position"
          inputMode="numeric"
          placeholder="Last"
          {...text("position")}
        />
      </div>
    </DialogForm>
  )
}

export function CampusTypeDialog({
  type,
  trigger,
  disabled,
  onSubmit,
}: {
  type?: AdminCampusType
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (input: CampusTypeInput) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={type ? `Edit ${type.name}` : "Add a campus type"}
      description="The kinds of campus this country has, in its own words. Lower positions come first wherever they are listed."
    >
      <CampusTypeForm type={type} onSubmit={onSubmit} />
    </FormDialog>
  )
}
