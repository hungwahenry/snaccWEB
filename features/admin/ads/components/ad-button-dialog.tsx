"use client"

import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdButton, AdButtonDraft } from "../types"
import {
  AD_BUTTON_LIMITS,
  buttonDraftFrom,
  isButtonDraftReady,
} from "../utils/ad-buttons"

function AdButtonForm({
  button,
  onSubmit,
}: {
  button?: AdButton
  onSubmit: (draft: AdButtonDraft) => Promise<unknown>
}) {
  const { draft, text } = useDraft(() => buttonDraftFrom(button))

  return (
    <DialogForm
      submitLabel={button ? "Save" : "Add label"}
      canSubmit={isButtonDraftReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_6rem]">
        <TextField
          label="Slug"
          placeholder="shop_now"
          maxLength={AD_BUTTON_LIMITS.slug}
          {...text("slug")}
        />
        <TextField
          label="Label"
          placeholder="Shop now"
          maxLength={AD_BUTTON_LIMITS.label}
          {...text("label")}
        />
        <TextField label="Position" inputMode="numeric" {...text("position")} />
      </div>
      <FormNote>
        Advertisers pick from these for the button under their promotion. Keep
        each one short enough to read at a glance.
      </FormNote>
    </DialogForm>
  )
}

export function AdButtonDialog({
  button,
  trigger,
  disabled,
  onSubmit,
}: {
  button?: AdButton
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: AdButtonDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={button ? `Edit ${button.label}` : "New button label"}
      wide
    >
      <AdButtonForm button={button} onSubmit={onSubmit} />
    </FormDialog>
  )
}
