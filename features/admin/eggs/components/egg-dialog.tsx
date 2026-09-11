"use client"

import type { ReactElement } from "react"
import {
  SelectField,
  SwitchField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminEgg, EggDraft } from "../types"
import {
  draftFrom,
  EGG_LIMITS,
  isDraftReady,
  parseTrigger,
  RARITY_OPTIONS,
  TRIGGER_INVALID,
} from "../utils/egg"

const TRIGGER_EXAMPLE =
  '{"on": "tap", "where": {"anchor": "wordmark"}, "burst": {"count": 7, "windowMs": 4000}}'

function EggForm({
  egg,
  onSubmit,
}: {
  egg?: AdminEgg
  onSubmit: (draft: EggDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => draftFrom(egg))
  const editing = egg !== undefined
  const triggerOk = parseTrigger(draft.trigger).ok

  return (
    <DialogForm
      submitLabel={editing ? "Save" : "Hide egg"}
      canSubmit={isDraftReady(draft, editing)}
      onSubmit={() => onSubmit(draft)}
    >
      {editing ? null : (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Slug"
            placeholder="tuesday-surprise"
            hint="Lowercase letters, numbers and dashes. It cannot change later."
            mono
            maxLength={EGG_LIMITS.slug}
            autoComplete="off"
            {...text("slug")}
          />
          <SelectField
            label="Rarity"
            value={draft.rarity}
            onChange={(rarity) => set("rarity", rarity)}
            options={RARITY_OPTIONS}
            hint="It cannot change later."
          />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
        <TextField
          label="Name"
          placeholder="Sevens"
          maxLength={EGG_LIMITS.name}
          {...text("name")}
        />
        <TextField
          label="Colour"
          placeholder="#c23d6e"
          hint="A hex colour."
          mono
          maxLength={EGG_LIMITS.color}
          autoComplete="off"
          {...text("color")}
        />
      </div>
      <TextField
        label="Description"
        placeholder="Shown once it is found."
        maxLength={EGG_LIMITS.description}
        {...text("description")}
      />
      <TextField
        label="Hint"
        optional
        hint="Shown in the collection before anyone finds it. Leave it blank to keep the egg a complete secret."
        maxLength={EGG_LIMITS.hint}
        {...text("hint")}
      />
      <TextField
        label="Trigger"
        optional
        multiline
        rows={6}
        mono
        placeholder={TRIGGER_EXAMPLE}
        hint={
          triggerOk ? (
            "A JSON object. Leave it blank and only the server can hand the egg out."
          ) : (
            <span className="text-destructive">{TRIGGER_INVALID}</span>
          )
        }
        {...text("trigger")}
      />
      {editing ? (
        <SwitchField
          label="Discoverable"
          hint="Off hides it from every phone until you turn it back on."
          checked={draft.enabled}
          onChange={(enabled) => set("enabled", enabled)}
        />
      ) : null}
      <FormNote>
        A trigger reaches every phone on its next refresh. Eggs the server has
        to check need code on the server too, so keep the ones you add here to
        triggers the phone can spot by itself.
      </FormNote>
    </DialogForm>
  )
}

export function EggDialog({
  egg,
  trigger,
  disabled,
  onSubmit,
}: {
  egg?: AdminEgg
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: EggDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      wide
      title={egg ? `Edit ${egg.name}` : "Hide a new egg"}
    >
      <EggForm egg={egg} onSubmit={onSubmit} />
    </FormDialog>
  )
}
