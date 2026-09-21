import { dateAtTime, weekdayDate } from "@/lib/format"
import type { HangoutState, SnaccHangout } from "../types"

type Timed = Pick<SnaccHangout, "state" | "starts_at" | "wraps_at">

export function hangoutTitle(
  hangout: Pick<SnaccHangout, "emoji" | "title">
): string {
  return `${hangout.emoji} ${hangout.title}`
}

export function stateAt(hangout: Timed, now: number): HangoutState {
  if (hangout.state === "cancelled") return "cancelled"
  if (now < Date.parse(hangout.starts_at)) return "upcoming"
  if (now < Date.parse(hangout.wraps_at)) return "happening"
  return "over"
}

export function isOngoing(hangout: Timed, now: number): boolean {
  const state = stateAt(hangout, now)
  return state === "upcoming" || state === "happening"
}

export function canPostFrom(
  hangout: Timed & Pick<SnaccHangout, "join_state">,
  now: number
): boolean {
  return hangout.join_state === "going" && stateAt(hangout, now) !== "cancelled"
}

export function whenLineFor(
  state: HangoutState,
  startsAt: string,
  timeZone?: string
): string {
  switch (state) {
    case "cancelled":
      return `Called off · ${weekdayDate(startsAt, timeZone)}`
    case "upcoming":
      return dateAtTime(startsAt, timeZone)
    case "happening":
      return "Happening now"
    case "over":
      return `Over · ${weekdayDate(startsAt, timeZone)}`
  }
}

export function whenLine(hangout: Timed, now: number): string {
  return whenLineFor(stateAt(hangout, now), hangout.starts_at)
}

export function goingLine(
  hangout: Pick<SnaccHangout, "going_count" | "capacity">
): string {
  return `${hangout.going_count} of ${hangout.capacity} going`
}

export function placeLine(hangout: Pick<SnaccHangout, "place">): string {
  return hangout.place ?? "Shown to people going"
}
