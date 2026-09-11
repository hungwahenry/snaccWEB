"use client"

import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import {
  SelectField,
  SwitchField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminReportReason, ReasonDraft } from "../types"
import {
  draftFrom,
  isDraftReady,
  REPORT_REASON_LIMITS,
  TARGET_OPTIONS,
} from "../utils/report-reasons"

function ReportReasonForm({
  reason,
  onSubmit,
}: {
  reason?: AdminReportReason
  onSubmit: (draft: ReasonDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => draftFrom(reason))
  const editing = reason !== undefined

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={isDraftReady(draft, editing)}
      onSubmit={() => onSubmit(draft)}
    >
      {editing ? null : (
        <TextField
          label="Slug"
          placeholder="spam"
          maxLength={REPORT_REASON_LIMITS.slug}
          {...text("slug")}
        />
      )}
      <TextField
        label="Label"
        maxLength={REPORT_REASON_LIMITS.label}
        {...text("label")}
      />
      <TextField
        label="Hint"
        optional
        maxLength={REPORT_REASON_LIMITS.hint}
        {...text("hint")}
      />
      <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
        <SelectField
          label="Applies to"
          value={draft.appliesTo}
          onChange={(appliesTo) => set("appliesTo", appliesTo)}
          options={TARGET_OPTIONS}
        />
        <TextField label="Position" inputMode="numeric" {...text("position")} />
      </div>
      <SwitchField
        label="Requires a written detail"
        checked={draft.requiresDetail}
        onChange={(requiresDetail) => set("requiresDetail", requiresDetail)}
      />
    </DialogForm>
  )
}

export function ReportReasonDialog({
  reason,
  trigger,
  disabled,
  onSubmit,
}: {
  reason?: AdminReportReason
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: ReasonDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={reason ? "Edit reason" : "New report reason"}
    >
      <ReportReasonForm reason={reason} onSubmit={onSubmit} />
    </FormDialog>
  )
}
