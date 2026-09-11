"use client"

import { useMemo, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import {
  SelectField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type {
  CategoryUsage,
  ModerationRule,
  ModerationSurface,
  RuleDraft,
} from "../types"
import { ACTION_HINTS, ACTION_OPTIONS } from "../utils/actions"
import {
  categoryOptions,
  draftFrom,
  isDraftReady,
  RULE_NOTE_LIMIT,
} from "../utils/rules"
import { SURFACE_KEY_OPTIONS } from "../utils/surfaces"

function CategoryHint({ category }: { category: CategoryUsage }) {
  return (
    <>
      {category.description}
      {category.scores_image ? null : (
        <span className="block text-destructive">
          Scored from text only — this rule will never fire on a picture.
        </span>
      )}
    </>
  )
}

function RuleForm({
  rule,
  surface,
  categories,
  onSubmit,
}: {
  rule?: ModerationRule
  surface?: ModerationSurface | null
  categories: CategoryUsage[]
  onSubmit: (draft: RuleDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => draftFrom(rule, surface))
  const options = useMemo(() => categoryOptions(categories), [categories])
  const chosen = categories.find((entry) => entry.category === draft.category)

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={isDraftReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <div className="flex gap-3">
        <SelectField
          label="Surface"
          className="flex-1"
          value={draft.surface}
          onChange={(next) => set("surface", next)}
          options={SURFACE_KEY_OPTIONS}
        />
        <TextField
          label="Threshold"
          className="w-32"
          inputMode="decimal"
          placeholder="0.85"
          {...text("threshold")}
        />
      </div>
      <SelectField
        label="Category"
        value={draft.category || null}
        onChange={(next) => set("category", next)}
        options={options}
        placeholder="Pick a category…"
        hint={chosen ? <CategoryHint category={chosen} /> : undefined}
      />
      <SelectField
        label="What it does"
        value={draft.action}
        onChange={(next) => set("action", next)}
        options={ACTION_OPTIONS}
        hint={ACTION_HINTS[draft.action]}
      />
      <TextField
        label="Why this number"
        multiline
        rows={3}
        maxLength={RULE_NOTE_LIMIT}
        placeholder="What you measured, or what you are trading off."
        {...text("note")}
      />
    </DialogForm>
  )
}

export function RuleDialog({
  rule,
  surface,
  categories,
  trigger,
  disabled,
  onSubmit,
}: {
  rule?: ModerationRule
  surface?: ModerationSurface | null
  categories: CategoryUsage[]
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: RuleDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={rule ? "Edit rule" : "New rule"}
    >
      <RuleForm
        rule={rule}
        surface={surface}
        categories={categories}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
