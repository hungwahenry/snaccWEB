import {
  windowErrors,
  windowLabel,
} from "@/features/admin/feature-flags/utils/flags"
import type { Option } from "@/features/admin/shell/types"
import { plural } from "@/features/admin/shell/utils/format"
import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type {
  AnnouncementAudience,
  AnnouncementPlatform,
  AnnouncementPremium,
  AudienceDraft,
  AudienceErrors,
  AudienceInput,
} from "../types"

const DAYS_MAX = 365

const BAD_DAYS = `Use a number of days from 1 to ${DAYS_MAX}.`

export const PLATFORMS: AnnouncementPlatform[] = ["ios", "android", "web"]

export const PLATFORM_LABELS: Record<AnnouncementPlatform, string> = {
  ios: "iPhone",
  android: "Android",
  web: "Web",
}

export const PREMIUM_OPTIONS: Option<AnnouncementPremium>[] = [
  { value: "any", label: "Everyone" },
  { value: "premium", label: "Premium only" },
  { value: "free", label: "Not Premium" },
]

const PREMIUM_SUMMARY: Record<AnnouncementPremium, string | null> = {
  any: null,
  premium: "Premium only",
  free: "Not Premium",
}

export function pickPlatforms(
  values: readonly string[]
): AnnouncementPlatform[] {
  return PLATFORMS.filter((platform) => values.includes(platform))
}

function parseDays(text: string): number | null {
  return parseWholeNumber(text, { min: 1, max: DAYS_MAX })
}

function daysError(text: string): string | null {
  return text.trim() === "" || parseDays(text) !== null ? null : BAD_DAYS
}

export function audienceDraftFrom(
  audience?: AnnouncementAudience
): AudienceDraft {
  return {
    campusIds: audience?.campus_ids ?? [],
    platforms: pickPlatforms(audience?.platforms ?? []),
    minVersion: audience?.min_version ?? "",
    maxVersion: audience?.max_version ?? "",
    premium: audience?.premium ?? "any",
    joinedWithinDays: audience?.joined_within_days?.toString() ?? "",
    quietForDays: audience?.quiet_for_days?.toString() ?? "",
  }
}

export function audienceErrors(audience: AudienceDraft): AudienceErrors {
  const window = windowErrors(audience.minVersion, audience.maxVersion)

  return {
    minVersion: window.min,
    maxVersion: window.max,
    joinedWithinDays: daysError(audience.joinedWithinDays),
    quietForDays: daysError(audience.quietForDays),
  }
}

export function isAudienceValid(audience: AudienceDraft): boolean {
  return Object.values(audienceErrors(audience)).every(
    (error) => error === null
  )
}

export function toAudienceInput(audience: AudienceDraft): AudienceInput {
  return {
    campusIds: audience.campusIds,
    platforms: pickPlatforms(audience.platforms),
    minVersion: audience.minVersion.trim() || null,
    maxVersion: audience.maxVersion.trim() || null,
    premium: audience.premium,
    joinedWithinDays: parseDays(audience.joinedWithinDays),
    quietForDays: parseDays(audience.quietForDays),
  }
}

interface Part {
  lead: string
  rest: string
}

const named = (text: string): Part => ({ lead: text, rest: text })

const phrase = (text: string): Part => ({
  lead: text.charAt(0).toUpperCase() + text.slice(1),
  rest: text,
})

function campusesPart(
  ids: string[],
  acronyms: ReadonlyMap<string, string>
): Part | null {
  if (ids.length === 0) return null

  const known = ids.flatMap((id) => {
    const acronym = acronyms.get(id)
    return acronym ? [acronym] : []
  })
  const unknown = ids.length - known.length
  if (known.length === 0) return phrase(plural(unknown, "campus", "campuses"))

  return named(
    unknown > 0 ? `${known.join(", ")} +${unknown}` : known.join(", ")
  )
}

function platformsPart(platforms: AnnouncementPlatform[]): Part | null {
  const picked = pickPlatforms(platforms)

  return picked.length > 0
    ? named(picked.map((platform) => PLATFORM_LABELS[platform]).join(", "))
    : null
}

function windowPart(audience: AnnouncementAudience): Part | null {
  const window = windowLabel(audience)

  return window ? phrase(`app ${window}`) : null
}

function premiumPart(premium: AnnouncementPremium): Part | null {
  const label = PREMIUM_SUMMARY[premium]

  return label ? named(label) : null
}

function joinedPart(days: number | null): Part | null {
  if (days === null) return null

  return phrase(
    days === 1 ? "joined in the last day" : `joined in the last ${days} days`
  )
}

function quietPart(days: number | null): Part | null {
  if (days === null) return null

  return phrase(`quiet ${days}+ ${days === 1 ? "day" : "days"}`)
}

export function audienceSummary(
  audience: AnnouncementAudience,
  acronyms: ReadonlyMap<string, string>
): string {
  const parts = [
    campusesPart(audience.campus_ids, acronyms),
    platformsPart(audience.platforms),
    windowPart(audience),
    premiumPart(audience.premium),
    joinedPart(audience.joined_within_days),
    quietPart(audience.quiet_for_days),
  ].filter((part): part is Part => part !== null)

  if (parts.length === 0) return "Everyone"

  return parts
    .map((part, index) => (index === 0 ? part.lead : part.rest))
    .join(" · ")
}
