import { clockTime, shortDate } from "@/lib/format"
import type { MatchStatus } from "../types"

const LABELS: Record<"short" | "long", Partial<Record<MatchStatus, string>>> = {
  short: { live: "LIVE", halftime: "HT", finished: "FT", off: "OFF" },
  long: {
    live: "LIVE",
    halftime: "HALF TIME",
    finished: "FULL TIME",
    off: "CALLED OFF",
  },
}

export function statusLabel(
  status: MatchStatus,
  kickoffAt: string,
  length: "short" | "long" = "short"
): string {
  return (
    LABELS[length][status] ??
    (length === "short" ? clockTime(kickoffAt) : shortDate(kickoffAt))
  )
}
