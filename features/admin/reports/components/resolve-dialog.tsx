"use client"

import Link from "next/link"
import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import {
  CheckboxField,
  SelectField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import { threadPath } from "@/features/admin/shell/routes"
import { SuspensionFields } from "@/features/admin/suspension-reasons/components/suspension-fields"
import type { AdminReport, ResolveDraft, SuspensionChoices } from "../types"
import {
  actChoices,
  EMPTY_RESOLVE,
  messageThreadId,
  suspends,
  targetNoun,
  toggleAct,
} from "../utils/reports"
import { OUTCOME_OPTIONS } from "../utils/status"

function ResolveForm({
  report,
  suspension,
  onSubmit,
}: {
  report: AdminReport
  suspension: SuspensionChoices
  onSubmit: (draft: ResolveDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft<ResolveDraft>(EMPTY_RESOLVE)
  const choices = actChoices(report.target)
  const thread = messageThreadId(report.target)

  return (
    <DialogForm submitLabel="Resolve" onSubmit={() => onSubmit(draft)}>
      {thread ? (
        <Link
          href={threadPath(thread)}
          className="text-sm font-medium underline underline-offset-4"
        >
          View the full thread →
        </Link>
      ) : null}
      <SelectField
        label="Outcome"
        value={draft.status}
        onChange={(status) => set("status", status)}
        options={OUTCOME_OPTIONS}
      />
      {choices.length > 0 ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">
            Actions{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </legend>
          {choices.map((choice) => (
            <CheckboxField
              key={choice.value}
              label={choice.label}
              checked={draft.acts.includes(choice.value)}
              onChange={() => set("acts", toggleAct(draft.acts, choice.value))}
            />
          ))}
        </fieldset>
      ) : null}
      {suspends(draft.acts) ? (
        <SuspensionFields
          value={draft.suspension}
          onChange={(next) => set("suspension", next)}
          reasons={suspension.reasons}
          durations={suspension.durations}
        />
      ) : null}
      <TextField
        label="Note"
        optional
        multiline
        rows={3}
        maxLength={500}
        {...text("note")}
      />
    </DialogForm>
  )
}

export function ResolveDialog({
  report,
  suspension,
  trigger,
  disabled,
  onSubmit,
}: {
  report: AdminReport
  suspension: SuspensionChoices
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: ResolveDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Resolve reports"
      description={`Resolves every open report on this ${targetNoun(report.target)} together.`}
    >
      <ResolveForm
        report={report}
        suspension={suspension}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
