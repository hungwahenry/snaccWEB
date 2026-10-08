"use client"

import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import { TITLE_MAX, toTitle } from "../utils/packs"

function PackTitleForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial: string
  submitLabel: string
  onSubmit: (title: string) => Promise<unknown>
}) {
  const { draft, text } = useDraft({ title: initial })
  const title = toTitle(draft)

  return (
    <DialogForm
      submitLabel={submitLabel}
      canSubmit={title !== null && title !== initial}
      onSubmit={() => (title ? onSubmit(title) : undefined)}
    >
      <TextField
        label="Name"
        maxLength={TITLE_MAX}
        placeholder="Exam season"
        {...text("title")}
      />
    </DialogForm>
  )
}

export function PackTitleDialog({
  heading,
  description,
  initial = "",
  submitLabel,
  trigger,
  disabled,
  onSubmit,
}: {
  heading: string
  description?: string
  initial?: string
  submitLabel: string
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (title: string) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={heading}
      description={description}
    >
      <PackTitleForm
        initial={initial}
        submitLabel={submitLabel}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
