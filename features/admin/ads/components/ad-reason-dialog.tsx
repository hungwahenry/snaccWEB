"use client"

import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import {
  SwitchField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdReason, AdReasonDraft } from "../types"
import { AD_REASON_LIMITS, draftFrom, isDraftReady } from "../utils/ad-reasons"

function AdReasonForm({
  reason,
  onSubmit,
}: {
  reason?: AdReason
  onSubmit: (draft: AdReasonDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => draftFrom(reason))

  return (
    <DialogForm
      submitLabel={reason ? "Save" : "Add reason"}
      canSubmit={isDraftReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_6rem]">
        <TextField
          label="Slug"
          placeholder="alcohol"
          maxLength={AD_REASON_LIMITS.slug}
          {...text("slug")}
        />
        <TextField
          label="Name"
          placeholder="Alcohol"
          maxLength={AD_REASON_LIMITS.label}
          {...text("label")}
        />
        <TextField label="Position" inputMode="numeric" {...text("position")} />
      </div>
      <FormNote>
        The name is what a reviewer picks it by, and how a not-allowed reason is
        listed to advertisers. The wording below is for the advertiser whose
        promotion is turned down.
      </FormNote>
      <TextField
        label="What they read"
        multiline
        rows={4}
        maxLength={AD_REASON_LIMITS.description}
        hint="Write it to them, not about them. Say what was wrong and what they could promote instead."
        {...text("description")}
      />
      <SwitchField
        label="Listed to advertisers as not allowed"
        hint="Shown before they pay, so they know not to promote it."
        checked={draft.prohibited}
        onChange={(prohibited) => set("prohibited", prohibited)}
      />
    </DialogForm>
  )
}

export function AdReasonDialog({
  reason,
  trigger,
  disabled,
  onSubmit,
}: {
  reason?: AdReason
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: AdReasonDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={reason ? `Edit ${reason.label}` : "New ad rejection reason"}
      wide
    >
      <AdReasonForm reason={reason} onSubmit={onSubmit} />
    </FormDialog>
  )
}
