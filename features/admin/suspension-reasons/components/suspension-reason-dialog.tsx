"use client"

import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { SuspensionReason, SuspensionReasonDraft } from "../types"
import {
  draftFrom,
  isDraftReady,
  SUSPENSION_REASON_LIMITS,
} from "../utils/suspension-reasons"

function SuspensionReasonForm({
  reason,
  onSubmit,
}: {
  reason?: SuspensionReason
  onSubmit: (draft: SuspensionReasonDraft) => Promise<unknown>
}) {
  const { draft, text } = useDraft(() => draftFrom(reason))

  return (
    <DialogForm
      submitLabel={reason ? "Save" : "Add reason"}
      canSubmit={isDraftReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_6rem]">
        <TextField
          label="Slug"
          placeholder="harassment"
          maxLength={SUSPENSION_REASON_LIMITS.slug}
          {...text("slug")}
        />
        <TextField
          label="Name"
          placeholder="Harassment"
          maxLength={SUSPENSION_REASON_LIMITS.label}
          {...text("label")}
        />
        <TextField label="Position" inputMode="numeric" {...text("position")} />
      </div>
      <FormNote>
        The name is what a moderator picks it by, so keep it to the offence in a
        couple of words. The wording below is for the person suspended.
      </FormNote>
      <TextField
        label="Heading they see"
        maxLength={SUSPENSION_REASON_LIMITS.title}
        {...text("title")}
      />
      <TextField
        label="What they read"
        multiline
        rows={4}
        maxLength={SUSPENSION_REASON_LIMITS.description}
        hint="Write it to them, not about them. It is the only screen a suspended person can reach, so say what happened and what they can do next."
        {...text("description")}
      />
    </DialogForm>
  )
}

export function SuspensionReasonDialog({
  reason,
  trigger,
  disabled,
  onSubmit,
}: {
  reason?: SuspensionReason
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: SuspensionReasonDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={reason ? `Edit ${reason.label}` : "New suspension reason"}
      wide
    >
      <SuspensionReasonForm reason={reason} onSubmit={onSubmit} />
    </FormDialog>
  )
}
