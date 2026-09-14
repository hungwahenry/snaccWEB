"use client"

import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminBenefit, UpdateBenefitInput } from "../types"
import { BENEFIT_LIMITS, benefitDraft, toBenefitInput } from "../utils/premium"

function BenefitForm({
  benefit,
  onSubmit,
}: {
  benefit: AdminBenefit
  onSubmit: (input: UpdateBenefitInput) => Promise<unknown>
}) {
  const { draft, text } = useDraft(() => benefitDraft(benefit))
  const input = toBenefitInput(draft)

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={input !== null}
      onSubmit={() => (input ? onSubmit(input) : undefined)}
    >
      <TextField
        label="Heading"
        maxLength={BENEFIT_LIMITS.label}
        {...text("label")}
      />
      <TextField
        label="Line"
        multiline
        maxLength={BENEFIT_LIMITS.description}
        {...text("description")}
      />
    </DialogForm>
  )
}

export function BenefitDialog({
  benefit,
  trigger,
  disabled,
  onSubmit,
}: {
  benefit: AdminBenefit
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (input: UpdateBenefitInput) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={`Edit ${benefit.label}`}
    >
      <BenefitForm benefit={benefit} onSubmit={onSubmit} />
    </FormDialog>
  )
}
