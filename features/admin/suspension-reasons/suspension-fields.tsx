"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSuspensionReasons } from "./use-suspension-reasons"
import { DAY_MS } from "@/lib/duration"

const DURATIONS = [
  { value: "0", label: "Indefinitely", days: null as number | null },
  { value: "1", label: "1 day", days: 1 },
  { value: "3", label: "3 days", days: 3 },
  { value: "7", label: "7 days", days: 7 },
  { value: "30", label: "30 days", days: 30 },
]

export interface SuspensionDraft {
  reasonId: string
  duration: string
}

export const EMPTY_SUSPENSION: SuspensionDraft = { reasonId: "", duration: "0" }

/** The draft as the API wants it: an end date rather than a number of days. */
export function toSuspensionInput(draft: SuspensionDraft, note?: string) {
  const days =
    DURATIONS.find((option) => option.value === draft.duration)?.days ?? null

  return {
    reasonId: draft.reasonId || undefined,
    note: note?.trim() || undefined,
    until: days
      ? new Date(Date.now() + days * DAY_MS).toISOString()
      : undefined,
  }
}

/** Reason and length, shared by suspending directly and suspending off the back of a report. */
export function SuspensionFields({
  value,
  onChange,
}: {
  value: SuspensionDraft
  onChange: (next: SuspensionDraft) => void
}) {
  const reasons = useSuspensionReasons()
  const available = (reasons.data ?? []).filter((reason) => !reason.retired)
  const chosen = available.find((reason) => reason.id === value.reasonId)

  return (
    <>
      <div className="flex gap-3">
        <Field className="flex-1">
          <FieldLabel>Reason</FieldLabel>
          <Select
            value={value.reasonId}
            onValueChange={(next) =>
              next && onChange({ ...value, reasonId: next })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pick a reason…" />
            </SelectTrigger>
            <SelectContent>
              {available.map((reason) => (
                <SelectItem key={reason.id} value={reason.id}>
                  {reason.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field className="w-40">
          <FieldLabel>Length</FieldLabel>
          <Select
            value={value.duration}
            onValueChange={(next) =>
              next && onChange({ ...value, duration: next })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      {chosen ? (
        <div className="rounded-lg bg-muted px-3 py-2">
          <p className="text-xs font-medium">They will read:</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {chosen.description}
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Without a reason they get generic wording. Pick one so they know what
          happened.
        </p>
      )}
    </>
  )
}
