import type { Country, CountryPlaces } from "@/features/places/types"
import { namedRegions } from "@/features/places/utils/regions"
import { isApiError } from "@/lib/api/errors"
import { roundUpToStep } from "@/lib/calendar"
import { DAY_MS, MINUTE_MS } from "@/lib/duration"
import { formatNumber } from "@/lib/format"
import { formatMoney, inputToMoney, minorDigits, type Money } from "@/lib/money"
import type {
  AdAudience,
  AdPlacement,
  Campaign,
  CampaignAudience,
  CampaignDraft,
  Choice,
  CreateCampaignInput,
  DraftField,
  DraftLimits,
  DraftProblems,
  ReachEstimate,
  ScheduleEnd,
  SetupRow,
} from "../types"
import { campaignSetupRows, PLACEMENT_CHOICES, SLOT_MINUTES } from "./campaigns"

export const HASHTAGS_MAX = 10

const DEFAULT_DAYS = 7

export function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

export function placementChoices(clip: boolean): Choice<AdPlacement>[] {
  return clip
    ? PLACEMENT_CHOICES
    : PLACEMENT_CHOICES.filter((choice) => choice.value !== "clips")
}

export function newDraft(
  now: number,
  clip: boolean,
  maxDays: number,
  countryCode: string
): CampaignDraft {
  const days = Math.max(1, Math.min(DEFAULT_DAYS, maxDays))

  return {
    countryCode,
    campuses: [],
    regionIds: [],
    campusTypeIds: [],
    genders: [],
    graduationFrom: null,
    graduationTo: null,
    standing: "any",
    platforms: [],
    joinedWithinDays: null,
    hashtags: [],
    placements: placementChoices(clip).map((choice) => choice.value),
    buttonId: null,
    buttonUrl: "",
    startsAt: null,
    endsAt: roundUpToStep(
      new Date(now + days * DAY_MS),
      SLOT_MINUTES
    ).toISOString(),
    budget: "",
  }
}

export function draftFromCampaign(
  campaign: Campaign,
  now: number,
  clip: boolean,
  maxDays: number
): CampaignDraft {
  const ran = Date.parse(campaign.ends_at) - Date.parse(campaign.starts_at)
  const days = Math.max(1, Math.min(maxDays, Math.round(ran / DAY_MS)))
  const { audience } = campaign

  return {
    ...newDraft(now, clip, maxDays, audience.country.code),
    campuses: audience.campuses,
    regionIds: audience.regions.map((region) => region.id),
    campusTypeIds: audience.campus_types.map((type) => type.id),
    genders: audience.genders,
    graduationFrom: audience.graduation_from,
    graduationTo: audience.graduation_to,
    standing: audience.standing,
    platforms: audience.platforms,
    joinedWithinDays: audience.joined_within_days,
    hashtags: audience.hashtags,
    placements: campaign.placements.filter(
      (placement) => clip || placement !== "clips"
    ),
    buttonId: campaign.button?.id ?? null,
    buttonUrl: campaign.button?.url ?? "",
    endsAt: roundUpToStep(
      new Date(now + days * DAY_MS),
      SLOT_MINUTES
    ).toISOString(),
    budget: wholeUnitsOf(campaign.budget),
  }
}

export function wholeUnitsOf(amount: Money): string {
  return String(Math.round(amount.amount / 10 ** minorDigits(amount.currency)))
}

export function wholeUnits(raw: string): string {
  return raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "")
}

export function addHashtag(tags: string[], raw: string): string[] {
  const tag = raw.trim().replace(/^#+/, "").toLowerCase()
  if (!tag || /\s/.test(tag) || tags.includes(tag)) return tags
  if (tags.length >= HASHTAGS_MAX) return tags
  return [...tags, tag]
}

export function audienceOf(draft: CampaignDraft): AdAudience {
  return {
    countryCode: draft.countryCode,
    campusIds: draft.campuses.map((campus) => campus.id),
    regionIds: draft.regionIds,
    campusTypeIds: draft.campusTypeIds,
    genders: draft.genders,
    graduationFrom: draft.graduationFrom,
    graduationTo: draft.graduationTo,
    standing: draft.standing,
    platforms: draft.platforms,
    joinedWithinDays: draft.joinedWithinDays,
    hashtags: draft.hashtags,
  }
}

export function draftAudience(
  draft: CampaignDraft,
  places: CountryPlaces | null
): CampaignAudience {
  return {
    country: { code: draft.countryCode, name: places?.name ?? "" },
    campuses: draft.campuses,
    regions: namedRegions(places?.regions ?? [], draft.regionIds),
    campus_types: (places?.campus_types ?? [])
      .filter((type) => draft.campusTypeIds.includes(type.id))
      .map((type) => ({ id: type.id, name: type.name })),
    genders: draft.genders,
    graduation_from: draft.graduationFrom,
    graduation_to: draft.graduationTo,
    standing: draft.standing,
    platforms: draft.platforms,
    joined_within_days: draft.joinedWithinDays,
    hashtags: draft.hashtags,
  }
}

export function reviewRows({
  draft,
  places,
  buttonLabel,
  start,
  end,
  estimate,
  budget,
}: {
  draft: CampaignDraft
  places: CountryPlaces | null
  buttonLabel: string | null
  start: string
  end: string
  estimate: ReachEstimate | null
  budget: Money
}): SetupRow[] {
  const link = draft.buttonUrl.trim()

  return [
    ...campaignSetupRows({
      audience: draftAudience(draft, places),
      placements: draft.placements,
      button: buttonLabel && link ? { label: buttonLabel, url: link } : null,
    }),
    { label: "When it runs", lines: [`Starts ${start}`, `Ends ${end}`] },
    {
      label: "Budget",
      lines: [
        formatMoney(budget),
        ...(estimate?.views ? [estimate.views] : []),
      ],
    },
  ]
}

export function campaignInput(
  snaccId: string,
  draft: CampaignDraft,
  currency: string,
  now: number
): CreateCampaignInput {
  const link = draft.buttonUrl.trim()

  return {
    snaccId,
    budget: inputToMoney(draft.budget, currency),
    startsAt: draft.startsAt ?? new Date(now).toISOString(),
    endsAt: draft.endsAt,
    placements: draft.placements,
    buttonId: draft.buttonId,
    buttonUrl: link || null,
    audience: audienceOf(draft),
  }
}

export function scheduleBounds(
  end: ScheduleEnd,
  startsAt: string | null,
  now: number,
  { maxDays, maxLeadDays }: Pick<DraftLimits, "maxDays" | "maxLeadDays">
): { min: Date; max: Date } {
  if (end === "start") {
    return {
      min: new Date(now + SLOT_MINUTES * MINUTE_MS),
      max: new Date(now + maxLeadDays * DAY_MS),
    }
  }

  const start = startsAt ? Date.parse(startsAt) : now
  return {
    min: new Date(start + SLOT_MINUTES * MINUTE_MS),
    max: new Date(start + maxDays * DAY_MS),
  }
}

function isHttps(link: string): boolean {
  try {
    return new URL(link).protocol === "https:"
  } catch {
    return false
  }
}

function buttonProblem(buttonId: string | null, url: string): string | null {
  const link = url.trim()
  if (buttonId === null)
    return link ? "Pick what the button says, or clear the link." : null
  if (!link) return "Add the link the button opens."
  return isHttps(link) ? null : "Use a full link that starts with https://"
}

function scheduleProblem(
  draft: CampaignDraft,
  { now, maxDays, maxLeadDays }: DraftLimits
): string | null {
  const start = draft.startsAt ? Date.parse(draft.startsAt) : now
  const end = Date.parse(draft.endsAt)

  if (start < now) return "Pick a start time from now on."
  if (start - now > maxLeadDays * DAY_MS)
    return `A promotion can start up to ${maxLeadDays} days from now.`
  if (end <= start) return "The end has to come after the start."
  if (end - start > maxDays * DAY_MS)
    return `A promotion can run for up to ${maxDays} days.`
  return null
}

type MoneyLimits = Pick<DraftLimits, "minBudget" | "balance">

function balanceProblem(amount: Money, balance: Money | null) {
  return balance !== null && amount.amount > balance.amount
    ? `That's more than your Snacc balance of ${formatMoney(balance)}.`
    : null
}

function budgetProblem(
  raw: string,
  { minBudget, balance }: MoneyLimits
): string | null {
  if (!raw) return null
  const amount = inputToMoney(raw, minBudget.currency)
  if (amount.amount < minBudget.amount)
    return `The smallest budget is ${formatMoney(minBudget)}.`
  return balanceProblem(amount, balance)
}

export function topUpProblem(
  raw: string,
  { minBudget, balance }: MoneyLimits
): string | null {
  if (!raw) return null
  const amount = inputToMoney(raw, minBudget.currency)
  if (amount.amount < minBudget.amount)
    return `Add at least ${formatMoney(minBudget)}.`
  return balanceProblem(amount, balance)
}

export function draftProblems(
  draft: CampaignDraft,
  limits: DraftLimits
): DraftProblems {
  const problems: DraftProblems = {}

  if (!draft.countryCode) problems.audience = "Pick the country it runs in."
  else if (
    draft.graduationFrom !== null &&
    draft.graduationTo !== null &&
    draft.graduationFrom > draft.graduationTo
  )
    problems.audience = "The graduation years are the wrong way round."
  if (draft.placements.length === 0)
    problems.placements = "Pick at least one place to show it."

  const button = buttonProblem(draft.buttonId, draft.buttonUrl)
  if (button) problems.button = button
  const schedule = scheduleProblem(draft, limits)
  if (schedule) problems.schedule = schedule
  const budget = budgetProblem(draft.budget, limits)
  if (budget) problems.budget = budget

  return problems
}

export function isReady(
  draft: CampaignDraft,
  problems: DraftProblems
): boolean {
  return Object.keys(problems).length === 0 && Number(draft.budget) > 0
}

const FIELD_BY_CODE: Partial<Record<string, DraftField>> = {
  budget_too_small: "budget",
  insufficient_funds: "budget",
  audience_too_small: "audience",
  unknown_hashtag: "audience",
  not_promotable: "general",
  wallet_frozen: "general",
  ads_web_only: "general",
}

export function submitProblem(
  error: unknown
): { field: DraftField; message: string } | null {
  if (!isApiError(error) || !error.code) return null
  const field = FIELD_BY_CODE[error.code]
  if (!field) return null

  const errors: Record<string, unknown> = error.errors ?? {}
  const minimum = errors.minimum as Money | undefined
  if (error.code === "budget_too_small" && minimum)
    return {
      field,
      message: `The smallest budget is ${formatMoney(minimum)}.`,
    }

  return { field, message: error.message }
}

const AUDIENCE_REFUSALS = new Set(["unknown_hashtag", "not_promotable"])

export function promotableCountries(
  countries: Country[],
  currency: string
): { value: string; label: string }[] {
  return countries
    .filter((country) => country.open && country.currency === currency)
    .map((country) => ({ value: country.code, label: country.name }))
}

export function reachProblem(
  error: unknown,
  people: number | undefined,
  minAudience: number
): string | null {
  if (isApiError(error) && error.code && AUDIENCE_REFUSALS.has(error.code))
    return error.message
  if (people !== undefined && people < minAudience)
    return `Aim it at at least ${formatNumber(minAudience)} people. Widen who it reaches.`
  return null
}
