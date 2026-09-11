import type { Option } from "@/features/admin/shell/types"
import { DAY_MS } from "@/lib/duration"
import type { SuspendInput, SuspensionDraft, SuspensionReason } from "../types"

const INDEFINITE = "0"

export const EMPTY_SUSPENSION: SuspensionDraft = {
  reasonId: null,
  days: INDEFINITE,
}

/** "Until they are let back" first, then each offered length in days. */
export function durationOptions(days: readonly string[]): Option[] {
  return [
    { value: INDEFINITE, label: "Until someone lifts it" },
    ...days
      .filter((day) => Number(day) > 0)
      .map((day) => ({
        value: day,
        label: Number(day) === 1 ? "1 day" : `${day} days`,
      })),
  ]
}

/** Reasons a moderator may still pick: retired ones stay on old suspensions only. */
export function pickableReasons(
  reasons: SuspensionReason[]
): SuspensionReason[] {
  return reasons
    .filter((reason) => !reason.retired)
    .sort((a, b) => a.position - b.position)
}

export function toSuspendInput(
  draft: SuspensionDraft,
  note = "",
  now = Date.now()
): SuspendInput {
  const days = Number(draft.days)

  return {
    reasonId: draft.reasonId ?? undefined,
    note: note.trim() || undefined,
    until: days > 0 ? new Date(now + days * DAY_MS).toISOString() : undefined,
  }
}
