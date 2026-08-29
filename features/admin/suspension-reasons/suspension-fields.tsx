"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useConfigValue } from "@/features/config/use-config-value"
import { useSuspensionReasons } from "./use-suspension-reasons"
import { DAY_MS } from "@/lib/duration"

const DURATIONS_KEY = "moderation.suspension.durations_days"
const DURATIONS_FALLBACK = ["1", "3", "7", "30"]
const INDEFINITE = "0"

function spanLabel(days: number): string {
  return days === 1 ? "1 day" : `${days} days`
}

export interface SuspensionDraft {
  reasonId: string
  duration: string
}

export const EMPTY_SUSPENSION: SuspensionDraft = {
  reasonId: "",
  duration: INDEFINITE,
}

export function toSuspensionInput(draft: SuspensionDraft, note?: string) {
  const days = Number(draft.duration)

  return {
    reasonId: draft.reasonId || undefined,
    note: note?.trim() || undefined,
    until: days
      ? new Date(Date.now() + days * DAY_MS).toISOString()
      : undefined,
  }
}

export function SuspensionFields({
  value,
  onChange,
}: {
  value: SuspensionDraft
  onChange: (next: SuspensionDraft) => void
}) {
  // The lengths on offer are policy, held once in config and read by the app as well.
  const offered = useConfigValue<string[]>(DURATIONS_KEY, DURATIONS_FALLBACK)
  const durations = [
    { value: INDEFINITE, label: "Indefinitely" },
    ...offered.map((days) => ({ value: days, label: spanLabel(Number(days)) })),
  ]

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
                  {reason.label}
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
              {durations.map((option) => (
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
