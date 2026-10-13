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
import type { Option } from "@/features/admin/shell/types"
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
  where,
  whereOptions,
  categories,
  onSubmit,
}: {
  rule?: ModerationRule
  surface?: ModerationSurface | null
  where?: string | null
  whereOptions: Option[]
  categories: CategoryUsage[]
  onSubmit: (draft: RuleDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => draftFrom(rule, surface, where))
  const options = useMemo(() => categoryOptions(categories), [categories])
  const chosen = categories.find((entry) => entry.category === draft.category)

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={isDraftReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <SelectField
        label="Where"
        value={draft.where}
        onChange={(next) => set("where", next)}
        options={whereOptions}
        disabled={rule !== undefined}
        hint={
          rule
            ? "A rule stays where it was made. Add one for another country to tune it there."
            : "A country's own rule replaces the default one for this surface and category, for content by people on its campuses."
        }
      />
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
  where,
  whereOptions,
  categories,
  trigger,
  disabled,
  onSubmit,
}: {
  rule?: ModerationRule
  surface?: ModerationSurface | null
  where?: string | null
  whereOptions: Option[]
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
        where={where}
        whereOptions={whereOptions}
        categories={categories}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
