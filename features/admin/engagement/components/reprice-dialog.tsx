"use client"

import type { ReactElement, ReactNode } from "react"
import { TextField } from "@/features/admin/shell/components/form-fields"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminEngagementKind, EngagementDraft } from "../types"
import {
  draftErrors,
  draftFrom,
  isDraftReady,
  weightLabel,
} from "../utils/engagement"

function hint(error: string | null, shipped: number | null): ReactNode {
  if (error) return <span className="text-destructive">{error}</span>

  return `Shipped as ${weightLabel(shipped)}.`
}

function RepriceForm({
  kind,
  onSubmit,
}: {
  kind: AdminEngagementKind
  onSubmit: (draft: EngagementDraft) => Promise<unknown>
}) {
  const { draft, text } = useDraft(() => draftFrom(kind))
  const errors = draftErrors(draft)

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={isDraftReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <TextField
        label="Snacc Score points"
        optional
        inputMode="numeric"
        placeholder="Empty earns nothing"
        hint={hint(errors.scoreWeight, kind.default_score_weight)}
        {...text("scoreWeight")}
      />
      <TextField
        label="Weight in the feed"
        optional
        inputMode="decimal"
        placeholder="Empty is ignored by the feed"
        hint={hint(errors.feedWeight, kind.default_feed_weight)}
        {...text("feedWeight")}
      />
      <TextField
        label="Kobo paid to the author"
        optional
        inputMode="numeric"
        placeholder="Empty earns no money"
        hint={hint(errors.earnKobo, kind.default_earn_kobo)}
        {...text("earnKobo")}
      />
      <FormNote>
        Points and kobo are frozen into each credit when it is earned, so a
        change here prices new engagement only and never restates anyone&apos;s
        score or balance. The feed weight is read live.
      </FormNote>
    </DialogForm>
  )
}

export function RepriceDialog({
  kind,
  trigger,
  disabled,
  onSubmit,
}: {
  kind: AdminEngagementKind
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: EngagementDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={`Reprice ${kind.label}`}
      description={kind.description}
    >
      <RepriceForm kind={kind} onSubmit={onSubmit} />
    </FormDialog>
  )
}
