import { plural } from "@/features/admin/shell/utils/format"
import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type { StatusMeta } from "@/features/admin/shell/types"
import { formatNumber } from "@/lib/format"
import type {
  AdminEngagementKind,
  EngagementDraft,
  EngagementGroup,
  EngagementSource,
  EngagementWeight,
  UpdateEngagementInput,
  WeightParse,
} from "../types"

export const ENGAGEMENT_LIMITS = {
  scoreWeight: { min: -1_000, max: 1_000 },
  feedWeight: { min: -9_999.99, max: 9_999.99 },
  earnKobo: { min: 0, max: 1_000_000 },
} as const

export const OFF_STATUS: StatusMeta = { label: "Off", variant: "secondary" }
export const CHANGED_STATUS: StatusMeta = {
  label: "Changed from shipped",
  variant: "outline",
}

const SOURCES: Record<
  EngagementSource,
  { title: string; description: string }
> = {
  server: {
    title: "Recorded by Snacc",
    description: "Rows we wrote ourselves, so the counts can be trusted.",
  },
  client: {
    title: "Reported by the app",
    description:
      "The app says these happened, so each is capped at one per person per snacc.",
  },
}

const TWO_DECIMALS = /^-?(\d+(\.\d{1,2})?|\.\d{1,2})$/

const MESSAGES: Record<EngagementWeight, string> = {
  scoreWeight: "Use a whole number from -1,000 to 1,000.",
  feedWeight:
    "Use a number from -9,999.99 to 9,999.99, with at most 2 decimals.",
  earnKobo: "Use a whole number of kobo from 0 to 1,000,000.",
}

/** One price as typed. A blank field is null, which earns nothing (or, for the feed, is ignored). */
export function parseWeight(field: EngagementWeight, raw: string): WeightParse {
  const text = raw.trim()
  if (text === "") return { ok: true, value: null }

  const { min, max } = ENGAGEMENT_LIMITS[field]
  if (field === "feedWeight") {
    const value = Number(text)
    return TWO_DECIMALS.test(text) && value >= min && value <= max
      ? { ok: true, value }
      : { ok: false, message: MESSAGES.feedWeight }
  }

  const value = parseWholeNumber(text, { min, max })
  return value === null
    ? { ok: false, message: MESSAGES[field] }
    : { ok: true, value }
}

const asText = (value: number | null) => (value === null ? "" : String(value))

export function draftFrom(kind: AdminEngagementKind): EngagementDraft {
  return {
    scoreWeight: asText(kind.score_weight),
    feedWeight: asText(kind.feed_weight),
    earnKobo: asText(kind.earn_kobo),
  }
}

/** What is wrong with each field, or null where it is fine. */
export function draftErrors(
  draft: EngagementDraft
): Record<EngagementWeight, string | null> {
  const error = (field: EngagementWeight) => {
    const parsed = parseWeight(field, draft[field])
    return parsed.ok ? null : parsed.message
  }

  return {
    scoreWeight: error("scoreWeight"),
    feedWeight: error("feedWeight"),
    earnKobo: error("earnKobo"),
  }
}

export function isDraftReady(draft: EngagementDraft): boolean {
  return Object.values(draftErrors(draft)).every((error) => error === null)
}

export function toUpdateInput(draft: EngagementDraft): UpdateEngagementInput {
  const value = (field: EngagementWeight) => {
    const parsed = parseWeight(field, draft[field])
    if (!parsed.ok) throw new Error(parsed.message)
    return parsed.value
  }

  return {
    scoreWeight: value("scoreWeight"),
    feedWeight: value("feedWeight"),
    earnKobo: value("earnKobo"),
  }
}

/** A price for the table: a dash where it earns nothing. */
export function weightLabel(value: number | null): string {
  return value === null ? "—" : formatNumber(value)
}

/** The shipped prices in words, for the reset confirmation. */
export function shippedSummary(kind: AdminEngagementKind): string {
  const score =
    kind.default_score_weight === null
      ? "no points"
      : plural(kind.default_score_weight, "point")
  const feed =
    kind.default_feed_weight === null
      ? "no feed weight"
      : `a feed weight of ${formatNumber(kind.default_feed_weight)}`
  const kobo =
    kind.default_earn_kobo === null
      ? "no kobo"
      : `${formatNumber(kind.default_earn_kobo)} kobo`

  return `${score}, ${feed} and ${kobo}`
}

/** Acts recorded by Snacc first, then the ones the app reports, leaving out a side with none. */
export function groupBySource(kinds: AdminEngagementKind[]): EngagementGroup[] {
  return (["server", "client"] as const)
    .map((source) => ({
      source,
      ...SOURCES[source],
      kinds: kinds.filter((kind) => kind.source === source),
    }))
    .filter((group) => group.kinds.length > 0)
}
