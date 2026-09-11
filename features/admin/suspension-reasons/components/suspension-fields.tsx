"use client"

import { SelectField } from "@/features/admin/shell/components/form-fields"
import type { Option } from "@/features/admin/shell/types"
import type { SuspensionDraft, SuspensionReason } from "../types"

/** The reason and length pickers every suspension asks for, wherever it starts. */
export function SuspensionFields({
  value,
  onChange,
  reasons,
  durations,
}: {
  value: SuspensionDraft
  onChange: (next: SuspensionDraft) => void
  reasons: SuspensionReason[]
  durations: Option[]
}) {
  const chosen = reasons.find((reason) => reason.id === value.reasonId)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <SelectField
          label="Reason"
          value={value.reasonId}
          onChange={(reasonId) => onChange({ ...value, reasonId })}
          options={reasons.map((reason) => ({
            value: reason.id,
            label: reason.label,
          }))}
          placeholder="Pick a reason"
        />
        <SelectField
          label="How long"
          value={value.days}
          onChange={(days) => onChange({ ...value, days })}
          options={durations}
        />
      </div>
      {chosen ? (
        <div className="rounded-lg bg-muted px-3 py-2 text-xs">
          <p className="font-medium">They will read:</p>
          <p className="mt-1 font-medium">{chosen.title}</p>
          <p className="text-pretty text-muted-foreground">
            {chosen.description}
          </p>
        </div>
      ) : (
        <p className="text-xs text-pretty text-muted-foreground">
          Without a reason they get generic wording. Pick one so they know what
          happened.
        </p>
      )}
    </div>
  )
}
