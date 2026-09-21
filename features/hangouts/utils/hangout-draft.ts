import { countLabel } from "@/lib/format"
import type {
  HangoutDraft,
  HangoutLimits,
  HangoutPayload,
  SnaccHangout,
} from "../types"

const MINUTE_MS = 60_000
const DAY_MS = 86_400_000
const FRESH_EMOJI = "🎉"
const FRESH_CAPACITY = 6

export function clampCapacity(capacity: number, limits: HangoutLimits): number {
  return Math.min(limits.capacityMax, Math.max(limits.capacityMin, capacity))
}

export function freshHangout(limits: HangoutLimits): HangoutDraft {
  return {
    title: "",
    emoji: FRESH_EMOJI,
    place: "",
    startsAt: null,
    capacity: clampCapacity(FRESH_CAPACITY, limits),
    private: false,
  }
}

function tooSoon(at: number, now: number, limits: HangoutLimits): boolean {
  return at < now + limits.minLeadMinutes * MINUTE_MS
}

export function timeProblem(
  startsAt: string | null,
  limits: HangoutLimits,
  now: number
): string | null {
  if (startsAt === null) return null

  const at = Date.parse(startsAt)
  if (tooSoon(at, now, limits)) {
    return `Pick a time at least ${countLabel(limits.minLeadMinutes, "minute")} from now.`
  }
  if (at > now + limits.maxAheadDays * DAY_MS) {
    return `A hangout can be planned up to ${countLabel(limits.maxAheadDays, "day")} ahead.`
  }
  return null
}

function fits(text: string, max: number): boolean {
  const trimmed = text.trim()
  return trimmed.length > 0 && trimmed.length <= max
}

export function checkHangout(
  draft: HangoutDraft | null,
  limits: HangoutLimits,
  now: number,
  keptStart: string | null = null
): { valid: boolean; timeProblem: string | null } {
  if (!draft) return { valid: false, timeProblem: null }

  const problem =
    draft.startsAt === keptStart
      ? null
      : timeProblem(draft.startsAt, limits, now)

  return {
    valid:
      fits(draft.title, limits.titleMax) &&
      fits(draft.place, limits.placeMax) &&
      draft.startsAt !== null &&
      problem === null &&
      draft.capacity === clampCapacity(draft.capacity, limits),
    timeProblem: problem,
  }
}

export function fromHangout(hangout: SnaccHangout): HangoutDraft {
  return {
    title: hangout.title,
    emoji: hangout.emoji,
    place: hangout.place ?? "",
    startsAt: hangout.starts_at,
    capacity: hangout.capacity,
    private: hangout.private,
  }
}

export function hangoutChanged(
  draft: HangoutDraft,
  from: HangoutDraft
): boolean {
  return (
    draft.title.trim() !== from.title ||
    draft.emoji !== from.emoji ||
    draft.place.trim() !== from.place ||
    draft.startsAt !== from.startsAt ||
    draft.capacity !== from.capacity ||
    draft.private !== from.private
  )
}

export function hangoutPayload(
  draft: HangoutDraft
): HangoutPayload | undefined {
  if (draft.startsAt === null) return undefined

  return {
    title: draft.title.trim(),
    emoji: draft.emoji,
    place: draft.place.trim(),
    startsAt: draft.startsAt,
    capacity: draft.capacity,
    private: draft.private,
  }
}
