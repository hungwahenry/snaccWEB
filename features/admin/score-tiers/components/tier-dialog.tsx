"use client"

import { useId, type ReactElement, type ReactNode } from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import { NamedIcon } from "@/lib/icons/named-icon"
import type { AdminTier, TierDraft } from "../types"
import {
  draftFrom,
  ICON_OPTIONS,
  isDraftReady,
  MIN_SCORE_INVALID,
  parseMinScore,
  parsePosition,
  POSITION_INVALID,
  TIER_LIMITS,
} from "../utils/tier"

function problem(show: boolean, message: string): ReactNode {
  return show ? <span className="text-destructive">{message}</span> : null
}

function TierForm({
  tier,
  onSubmit,
}: {
  tier?: AdminTier
  onSubmit: (draft: TierDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => draftFrom(tier))
  const iconId = useId()

  return (
    <DialogForm
      submitLabel={tier ? "Save" : "Add tier"}
      canSubmit={isDraftReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Key"
          placeholder="diamond"
          maxLength={TIER_LIMITS.key}
          {...text("key")}
        />
        <TextField
          label="Name people see"
          optional
          placeholder="Voice"
          maxLength={TIER_LIMITS.label}
          {...text("label")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Starts at score"
          inputMode="numeric"
          hint={problem(
            draft.minScore.trim() !== "" &&
              parseMinScore(draft.minScore) === null,
            MIN_SCORE_INVALID
          )}
          {...text("minScore")}
        />
        <TextField
          label="Position"
          inputMode="numeric"
          hint={problem(
            draft.position.trim() !== "" &&
              parsePosition(draft.position) === null,
            POSITION_INVALID
          )}
          {...text("position")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor={iconId}>Icon</FieldLabel>
          <div className="flex items-center gap-2">
            <OptionSelect
              id={iconId}
              label="Icon"
              allLabel="No icon"
              value={draft.icon || null}
              onChange={(icon) => set("icon", icon ?? "")}
              options={ICON_OPTIONS}
              className="flex-1"
            />
            <NamedIcon
              name={draft.icon}
              color={draft.color}
              className="size-5 shrink-0"
            />
          </div>
        </Field>
        <TextField
          label="Colour"
          optional
          placeholder="#38BDF8"
          maxLength={TIER_LIMITS.color}
          {...text("color")}
        />
      </div>
      <FormNote>
        The lowest score that earns this rung. Keep one tier starting at 0 so
        every account has a tier, and leave its icon off so it stays a plain
        handle. Saving moves everyone onto the right rung straight away.
      </FormNote>
    </DialogForm>
  )
}

export function TierDialog({
  tier,
  trigger,
  disabled,
  onSubmit,
}: {
  tier?: AdminTier
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: TierDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={tier ? `Edit ${tier.label || tier.key}` : "Add a tier"}
    >
      <TierForm tier={tier} onSubmit={onSubmit} />
    </FormDialog>
  )
}
