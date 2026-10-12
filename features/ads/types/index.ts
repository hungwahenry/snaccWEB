import type { Country, NamedPlace } from "@/features/places/types"
import type { Snacc } from "@/features/snaccs/types"
import type { University } from "@/features/universities/types"
import type { Gender } from "@/features/users/types"

export type AdPlacement = "feed" | "clips" | "discover" | "lists"

export interface PromotionLink {
  label: string
  url: string
}

export interface CampaignButton extends PromotionLink {
  id: string
}

export type CampaignPauser = "advertiser" | "admin"

export interface AdButtonOption {
  id: string
  slug: string
  label: string
}

export interface Promotion {
  campaign_id: string
  button: PromotionLink | null
}

export type PromotedSnacc = Snacc & { promoted: Promotion }

export interface OwnPromotion {
  campaign_id: string
  status: "pending" | "active" | "paused"
  views_count: number
  starts_at: string
}

export type AdEventKind = "view" | "click"

export interface AdEvent {
  campaignId: string
  kind: AdEventKind
  placement: AdPlacement
}

export type Standing = "any" | "students" | "graduates"

export type AdPlatform = "ios" | "android" | "web"

export interface AdAudience {
  countryCode: string
  campusIds: string[]
  regionIds: string[]
  campusTypeIds: string[]
  genders: Gender[]
  graduationFrom: number | null
  graduationTo: number | null
  standing: Standing
  platforms: AdPlatform[]
  joinedWithinDays: number | null
  hashtags: string[]
}

export type CampusPick = Pick<University, "id" | "name" | "acronym">

export type CampaignCountry = Pick<Country, "code" | "name">

export interface CampaignAudience {
  country: CampaignCountry
  campuses: CampusPick[]
  regions: NamedPlace[]
  campus_types: NamedPlace[]
  genders: Gender[]
  graduation_from: number | null
  graduation_to: number | null
  standing: Standing
  platforms: AdPlatform[]
  joined_within_days: number | null
  hashtags: string[]
}

export type CampaignStatus =
  "pending" | "active" | "paused" | "rejected" | "ended"

export type CampaignEndReason =
  "spent" | "expired" | "cancelled" | "removed" | "stopped"

export interface PolicyReason {
  id: string
  slug: string
  label: string
  description: string
  prohibited: boolean
}

export interface Campaign {
  id: string
  status: CampaignStatus
  paused_by: CampaignPauser | null
  end_reason: CampaignEndReason | null
  budget_kobo: number
  spent_kobo: number
  views_count: number
  clicks_count: number
  starts_at: string
  ends_at: string
  placements: AdPlacement[]
  button: CampaignButton | null
  audience: CampaignAudience
  reach: number
  rejection: (PolicyReason & { note: string | null }) | null
  reviewed_at: string | null
  ended_at: string | null
  created_at: string
  snacc: Snacc
}

export interface CampaignDay {
  day: string
  views: number
  clicks: number
  spent_kobo: number
}

export interface CampaignEngagement {
  likes: number
  replies: number
  resnaccs: number
  profile_visits: number
  follows: number
}

export interface CampaignCampusResult {
  university: CampusPick
  views: number
  spent_kobo: number
}

export interface CampaignDetail extends Campaign {
  days: CampaignDay[]
  engagement: CampaignEngagement
  campuses: CampaignCampusResult[]
}

export interface PriceRange {
  min: number
  max: number
}

export interface AdsInfo {
  price_per_thousand_kobo: PriceRange
  min_budget_kobo: number
  max_days: number
  campuses: number
  prohibited: string[]
}

export interface AdReach {
  people: number
  price_per_thousand_kobo: PriceRange
}

export interface BudgetPreset {
  kobo: number
  label: string
  views: string | null
}

export interface ReachEstimate {
  people: string
  price: string
  views: string | null
}

export interface CreateCampaignInput {
  snaccId: string
  budgetKobo: number
  startsAt: string
  endsAt: string
  placements: AdPlacement[]
  buttonId: string | null
  buttonUrl: string | null
  audience: AdAudience
}

export interface CampaignDraft {
  countryCode: string
  campuses: CampusPick[]
  regionIds: string[]
  campusTypeIds: string[]
  genders: Gender[]
  graduationFrom: number | null
  graduationTo: number | null
  standing: Standing
  platforms: AdPlatform[]
  joinedWithinDays: number | null
  hashtags: string[]
  placements: AdPlacement[]
  buttonId: string | null
  buttonUrl: string
  startsAt: string | null
  endsAt: string
  budget: string
}

export type DraftField =
  "audience" | "placements" | "button" | "schedule" | "budget" | "general"

export type DraftProblems = Partial<Record<DraftField, string>>

export interface DraftLimits {
  now: number
  minBudgetKobo: number
  maxDays: number
  maxLeadDays: number
  balanceKobo: number | null
}

export type ScheduleEnd = "start" | "end"

export type PromotionStep = "audience" | "placement" | "budget" | "review"

export interface SetupRow {
  label: string
  lines: string[]
}

export interface Choice<T extends string> {
  value: T
  label: string
}
