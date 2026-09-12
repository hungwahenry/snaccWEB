import { MINUTE_MS } from "@/lib/duration"
import type { LiveMatch, MatchDetail, MatchStatus } from "../types"

const PUSHED_POLL_MS = 5 * MINUTE_MS

/** Scores are pushed while realtime is on, so polling only has to catch what a dropped socket missed. */
export function pollEvery(pushed: boolean): number {
  return pushed ? PUSHED_POLL_MS : MINUTE_MS
}

export function matchPollEvery(
  status: MatchStatus | undefined,
  pushed: boolean
): number | false {
  return status === "live" || status === "halftime" ? pollEvery(pushed) : false
}

export function mayStillChange(status: MatchStatus | undefined): boolean {
  return status !== undefined && status !== "finished" && status !== "off"
}

export function withMatch(
  detail: MatchDetail | undefined,
  match: LiveMatch
): MatchDetail | undefined {
  if (!detail || detail.match.id !== match.id) return detail
  return { ...detail, match }
}
