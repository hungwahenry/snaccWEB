"use client"

import type { ReactElement } from "react"
import { TextField } from "@/features/admin/shell/components/form-fields"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminPrompt, PromptDraft } from "../types"
import {
  draftFrom,
  isDraftReady,
  parsePosition,
  POSITION_INVALID,
  PROMPT_LIMITS,
} from "../utils/prompt"

function PromptForm({
  prompt,
  onSubmit,
}: {
  prompt?: AdminPrompt
  onSubmit: (draft: PromptDraft) => Promise<unknown>
}) {
  const { draft, text } = useDraft(() => draftFrom(prompt))
  const positionOk = parsePosition(draft.position) !== null

  return (
    <DialogForm
      submitLabel={prompt ? "Save" : "Add prompt"}
      canSubmit={isDraftReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <div className="grid gap-4 sm:grid-cols-[6rem_1fr]">
        <TextField
          label="Emoji"
          placeholder="🔥"
          maxLength={PROMPT_LIMITS.emoji}
          autoComplete="off"
          {...text("emoji")}
        />
        <TextField
          label="Label"
          placeholder="Hot take"
          maxLength={PROMPT_LIMITS.label}
          {...text("label")}
        />
      </div>
      <TextField
        label="Placeholder"
        multiline
        placeholder="Drop a hot take about {campus}…"
        hint="{campus} becomes the person's campus acronym."
        maxLength={PROMPT_LIMITS.placeholder}
        {...text("placeholder")}
      />
      <TextField
        label="Position"
        inputMode="numeric"
        className="sm:max-w-40"
        hint={
          positionOk ? (
            "Lower numbers show first."
          ) : (
            <span className="text-destructive">{POSITION_INVALID}</span>
          )
        }
        {...text("position")}
      />
      <FormNote>
        New people see it as a starter chip on the first-post screen.
      </FormNote>
    </DialogForm>
  )
}

export function PromptDialog({
  prompt,
  trigger,
  disabled,
  onSubmit,
}: {
  prompt?: AdminPrompt
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: PromptDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={prompt ? `Edit ${prompt.label}` : "Add a prompt"}
    >
      <PromptForm prompt={prompt} onSubmit={onSubmit} />
    </FormDialog>
  )
}
