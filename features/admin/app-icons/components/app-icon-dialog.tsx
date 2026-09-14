"use client"

import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminAppIcon } from "../types"
import { appIconDraft, LABEL_MAX, toLabel } from "../utils/app-icons"

function AppIconForm({
  icon,
  onSubmit,
}: {
  icon: AdminAppIcon
  onSubmit: (label: string) => Promise<unknown>
}) {
  const { draft, text } = useDraft(() => appIconDraft(icon))
  const label = toLabel(draft)

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={label !== null}
      onSubmit={() => (label ? onSubmit(label) : undefined)}
    >
      <TextField
        label="Name in the picker"
        maxLength={LABEL_MAX}
        {...text("label")}
      />
    </DialogForm>
  )
}

export function AppIconDialog({
  icon,
  trigger,
  disabled,
  onSubmit,
}: {
  icon: AdminAppIcon
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (label: string) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={`Rename ${icon.label}`}
    >
      <AppIconForm icon={icon} onSubmit={onSubmit} />
    </FormDialog>
  )
}
