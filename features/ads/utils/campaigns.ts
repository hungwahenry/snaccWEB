import type { Snacc } from "@/features/snaccs/types"
import { GENDER_OPTIONS } from "@/features/users/utils/gender"
import type { StatusLook } from "@/features/wallet/types"
import { DAY_MS, MINUTE_MS } from "@/lib/duration"
import { dateAtTime, formatNaira, shortDate } from "@/lib/format"
import type {
  AdPlacement,
  AdPlatform,
  Campaign,
  CampaignAudience,
  CampaignEndReason,
  Choice,
  Ownership,
  PromotionLink,
  SetupRow,
  Standing,
} from "../types"
import { stateName } from "./regions"

export const SLOT_MINUTES = 5

export const FORM_SECTIONS = {
  audience: "Who sees it",
  placements: "Where it shows",
  button: "Button",
  schedule: "When it runs",
  budget: "Budget",
} as const

export const PLACEMENT_CHOICES: Choice<AdPlacement>[] = [
  { value: "feed", label: "Home feed" },
  { value: "clips", label: "Clips" },
  { value: "discover", label: "Discover" },
  { value: "lists", label: "Campus, tags and search" },
]

export const TARGET_GENDERS = GENDER_OPTIONS.filter(
  (option) => option.value !== "prefer_not_to_say"
)

export const OWNERSHIP_CHOICES: Choice<Ownership>[] = [
  { value: "federal", label: "Federal" },
  { value: "state", label: "State" },
  { value: "private", label: "Private" },
]

export const STANDING_CHOICES: Choice<Standing>[] = [
  { value: "any", label: "Everyone" },
  { value: "students", label: "Students" },
  { value: "graduates", label: "Graduates" },
]

export const PLATFORM_CHOICES: Choice<AdPlatform>[] = [
  { value: "ios", label: "iPhone" },
  { value: "android", label: "Android" },
  { value: "web", label: "Web" },
]

export const JOINED_CHOICES: { value: number; label: string }[] = [
  { value: 7, label: "In the last week" },
  { value: 30, label: "In the last month" },
  { value: 90, label: "In the last 3 months" },
  { value: 365, label: "In the last year" },
]

const ENDED: Record<CampaignEndReason, StatusLook> = {
  spent: { label: "Budget spent", tone: "quiet" },
  expired: { label: "Finished", tone: "quiet" },
  cancelled: { label: "Stopped", tone: "quiet" },
  removed: { label: "Taken down", tone: "bad" },
  stopped: { label: "Stopped by Snacc", tone: "bad" },
}

type StatusFields = Pick<
  Campaign,
  "status" | "paused_by" | "end_reason" | "starts_at"
>

const isScheduled = (campaign: StatusFields, now: number) =>
  campaign.status === "active" && Date.parse(campaign.starts_at) > now

export function campaignStatus(
  campaign: StatusFields,
  now: number
): StatusLook {
  switch (campaign.status) {
    case "pending":
      return { label: "In review", tone: "open" }
    case "active":
      return isScheduled(campaign, now)
        ? { label: "Scheduled", tone: "open" }
        : { label: "Running", tone: "good" }
    case "paused":
      return campaign.paused_by === "admin"
        ? { label: "Paused by Snacc", tone: "bad" }
        : { label: "Paused", tone: "quiet" }
    case "rejected":
      return { label: "Not approved", tone: "bad" }
    case "ended":
      return campaign.end_reason
        ? ENDED[campaign.end_reason]
        : { label: "Ended", tone: "quiet" }
  }
}

export function statusNote(
  campaign: StatusFields & Pick<Campaign, "ends_at" | "ended_at">,
  now: number
): string {
  switch (campaign.status) {
    case "pending":
      return "Snacc is checking it, usually within a few hours. It starts once it's approved, and the whole budget comes back if it isn't."
    case "active":
      return isScheduled(campaign, now)
        ? `Approved. It starts ${dateAtTime(campaign.starts_at)}.`
        : `Running until ${dateAtTime(campaign.ends_at)}.`
    case "paused":
      return campaign.paused_by === "admin"
        ? "Snacc has paused it while we look at it. Its budget is held, and only Snacc can start it again."
        : `Paused. It stays off until you resume it, and still ends ${dateAtTime(campaign.ends_at)}.`
    case "rejected":
      return "Not approved. The whole budget went back to your wallet."
    case "ended":
      return `Ended ${dateAtTime(campaign.ended_at ?? campaign.ends_at)}. Anything unspent went back to your wallet.`
  }
}

export function isOpen(campaign: Pick<Campaign, "status">): boolean {
  return (
    campaign.status === "pending" ||
    campaign.status === "active" ||
    campaign.status === "paused"
  )
}

export function canPause(campaign: Pick<Campaign, "status">): boolean {
  return campaign.status === "active"
}

export function canResume(
  campaign: Pick<Campaign, "status" | "paused_by">
): boolean {
  return campaign.status === "paused" && campaign.paused_by === "advertiser"
}

export function canPromoteAgain(campaign: Pick<Campaign, "status">): boolean {
  return campaign.status === "rejected" || campaign.status === "ended"
}

export function spendLine(
  campaign: Pick<Campaign, "spent_kobo" | "budget_kobo">
): string {
  return `${formatNaira(campaign.spent_kobo)} of ${formatNaira(campaign.budget_kobo)} spent`
}

export function budgetLeftLine(
  campaign: Pick<Campaign, "spent_kobo" | "budget_kobo">
): string {
  return `${formatNaira(Math.max(0, campaign.budget_kobo - campaign.spent_kobo))} left`
}

export function spentPercent(
  campaign: Pick<Campaign, "spent_kobo" | "budget_kobo">
): number {
  if (campaign.budget_kobo <= 0) return 0
  return Math.min(
    100,
    Math.round((campaign.spent_kobo / campaign.budget_kobo) * 100)
  )
}

export function runLine(campaign: Pick<Campaign, "starts_at" | "ends_at">) {
  return `${shortDate(campaign.starts_at)} – ${shortDate(campaign.ends_at)}`
}

export function campaignHeadline(snacc: Snacc): string {
  const body = snacc.body?.trim()
  if (body) return body
  if (snacc.clip) return "Clip"
  if (snacc.voice) return "Voice note"
  if (snacc.poll) return "Poll"
  if (snacc.images.length > 0) return "Photo"
  if (snacc.gif) return "GIF"
  if (snacc.sticker) return "Sticker"
  if (snacc.resnacc_of) return "Quote"
  return "Snacc"
}

export function campaignThumb(snacc: Snacc): string | null {
  if (snacc.spoiler) return null
  return (
    snacc.clip?.poster_thumb_url ??
    snacc.clip?.poster_url ??
    snacc.images[0]?.thumb_url ??
    snacc.gif?.preview_url ??
    null
  )
}

function labelsOf<T extends string>(choices: Choice<T>[], values: T[]) {
  return choices
    .filter((choice) => values.includes(choice.value))
    .map((choice) => choice.label)
    .join(", ")
}

function classLine(from: number | null, to: number | null): string | null {
  if (from !== null && to !== null)
    return from === to ? `Class of ${from}` : `Class of ${from}–${to}`
  if (from !== null) return `Class of ${from} or later`
  if (to !== null) return `Class of ${to} or earlier`
  return null
}

export function audienceLines(audience: CampaignAudience): string[] {
  const lines: string[] = []

  if (audience.campuses.length > 0)
    lines.push(
      `Campuses: ${audience.campuses.map((campus) => campus.acronym).join(", ")}`
    )
  if (audience.states.length > 0)
    lines.push(`States: ${audience.states.map(stateName).join(", ")}`)
  if (audience.ownerships.length > 0)
    lines.push(
      `School type: ${labelsOf(OWNERSHIP_CHOICES, audience.ownerships)}`
    )
  if (audience.genders.length > 0)
    lines.push(`Gender: ${labelsOf(GENDER_OPTIONS, audience.genders)}`)

  const graduation = classLine(audience.graduation_from, audience.graduation_to)
  if (graduation) lines.push(graduation)
  if (audience.standing === "students") lines.push("Students only")
  if (audience.standing === "graduates") lines.push("Graduates only")

  if (audience.platforms.length > 0)
    lines.push(`On ${labelsOf(PLATFORM_CHOICES, audience.platforms)}`)
  if (audience.joined_within_days !== null)
    lines.push(`Joined in the last ${audience.joined_within_days} days`)
  if (audience.hashtags.length > 0)
    lines.push(`Into ${audience.hashtags.map((tag) => `#${tag}`).join(", ")}`)

  return lines.length > 0 ? lines : ["Everyone on Snacc"]
}

export function placementsLine(placements: AdPlacement[]): string {
  return labelsOf(PLACEMENT_CHOICES, placements)
}

export function campaignSetupRows(campaign: {
  audience: CampaignAudience
  placements: AdPlacement[]
  button: PromotionLink | null
}): SetupRow[] {
  return [
    { label: "Who sees it", lines: audienceLines(campaign.audience) },
    { label: "Where it shows", lines: [placementsLine(campaign.placements)] },
    {
      label: "Button",
      lines: campaign.button
        ? [campaign.button.label, campaign.button.url]
        : ["No button"],
    },
  ]
}

export function extendBounds(
  campaign: Pick<Campaign, "starts_at" | "ends_at">,
  now: number,
  maxDays: number
): { min: Date; max: Date } {
  const from = Math.max(Date.parse(campaign.ends_at), now)
  return {
    min: new Date(from + SLOT_MINUTES * MINUTE_MS),
    max: new Date(Date.parse(campaign.starts_at) + maxDays * DAY_MS),
  }
}
