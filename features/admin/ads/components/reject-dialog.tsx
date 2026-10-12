"use client"

import Link from "next/link"
import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import {
  SelectField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import { AD_REASONS_PATH } from "@/features/admin/shell/routes"
import type { AdReason, RejectAdInput, RejectDraft } from "../types"
import { EMPTY_REJECTION, REJECT_NOTE_MAX, toRejectInput } from "../utils/ads"

function RejectForm({
  reasons,
  onSubmit,
}: {
  reasons: AdReason[]
  onSubmit: (input: RejectAdInput) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft<RejectDraft>(EMPTY_REJECTION)
  const input = toRejectInput(draft)
  const chosen = reasons.find((reason) => reason.id === draft.reasonId)

  return (
    <DialogForm
      submitLabel="Reject and refund"
      tone="destructive"
      canSubmit={input !== null}
      onSubmit={() => (input ? onSubmit(input) : undefined)}
    >
      <SelectField
        label="Reason"
        value={draft.reasonId}
        onChange={(reasonId) => set("reasonId", reasonId)}
        options={reasons.map((reason) => ({
          value: reason.id,
          label: reason.label,
        }))}
        placeholder="Pick a reason"
      />
      {chosen ? (
        <div className="rounded-lg bg-muted px-3 py-2 text-xs">
          <p className="font-medium">They will read:</p>
          <p className="text-pretty text-muted-foreground">
            {chosen.description}
          </p>
        </div>
      ) : reasons.length === 0 ? (
        <FormNote>
          There are no reasons to pick from yet. Add one on{" "}
          <Link href={AD_REASONS_PATH} className="underline underline-offset-4">
            Ad rejection reasons
          </Link>{" "}
          first.
        </FormNote>
      ) : null}
      <TextField
        label="Note for the advertiser"
        optional
        multiline
        rows={3}
        maxLength={REJECT_NOTE_MAX}
        hint="Shown to them under the reason."
        {...text("note")}
      />
    </DialogForm>
  )
}

export function RejectDialog({
  reasons,
  trigger,
  disabled,
  onSubmit,
}: {
  reasons: AdReason[]
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (input: RejectAdInput) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Reject this promotion"
      description="Its whole budget goes back to the advertiser's wallet, and they are told why."
    >
      <RejectForm reasons={reasons} onSubmit={onSubmit} />
    </FormDialog>
  )
}
