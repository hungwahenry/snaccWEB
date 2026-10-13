import type { NamedPlace } from "@/features/places/types"
import type { Snacc } from "@/features/snaccs/types"
import type { Money } from "@/lib/money"

export type AdStatus = "pending" | "active" | "paused" | "rejected" | "ended"

export type AdStatusFilter = AdStatus | "all"

export type AdEndReason =
  "spent" | "expired" | "cancelled" | "removed" | "stopped"

export type AdPlacement = "feed" | "clips" | "discover" | "lists"

export type AdGender = "male" | "female" | "non_binary" | "prefer_not_to_say"

export type AdStanding = "any" | "students" | "graduates"

export type AdPlatform = "ios" | "android" | "web"

export type AdAction = "approve" | "reject" | "pause" | "resume" | "end"

export interface AdLink {
  label: string
  url: string
}

export interface AdCampus {
  id: string
  name: string
  acronym: string
}

export interface AdAudience {
  country: { code: string; name: string }
  campuses: AdCampus[]
  regions: NamedPlace[]
  campus_types: NamedPlace[]
  genders: AdGender[]
  graduation_from: number | null
  graduation_to: number | null
  standing: AdStanding
  platforms: AdPlatform[]
  joined_within_days: number | null
  hashtags: string[]
}

export interface AdReason {
  id: string
  slug: string
  label: string
  description: string
  prohibited: boolean
  position: number
  retired: boolean
  created_at: string
}

export interface AdRejection {
  id: string
  slug: string
  label: string
  description: string
  prohibited: boolean
  note: string | null
}

export interface AdPerson {
  id: string
  username: string | null
  display_name: string | null
  campus: string | null
}

export interface AdminAd {
  id: string
  status: AdStatus
  paused_by: "advertiser" | "admin" | null
  end_reason: AdEndReason | null
  budget: Money
  spent: Money
  views_count: number
  clicks_count: number
  starts_at: string
  ends_at: string
  placements: AdPlacement[]
  button: AdLink | null
  audience: AdAudience
  reach: number
  rejection: AdRejection | null
  reviewed_at: string | null
  ended_at: string | null
  created_at: string
  advertiser: AdPerson | null
  reviewed_by: AdPerson | null
  settled_at: string | null
  snacc: Snacc & { deleted: boolean }
}

export type AdListQuery = {
  page: number
  perPage: number
  status?: AdStatus
  q?: string
}

export interface AdStats {
  by_status: { status: AdStatus; count: number }[]
  held: Money[]
  earned: Money[]
}

export interface AdStatusTab {
  value: AdStatusFilter
  label: string
  count: number | null
}

export interface AdFact {
  label: string
  value: string
}

export interface RejectAdInput {
  reasonId: string
  note?: string
}

export interface AdReviewActions {
  approve: () => Promise<unknown>
  reject: (input: RejectAdInput) => Promise<unknown>
  pause: () => Promise<unknown>
  resume: () => Promise<unknown>
  end: () => Promise<unknown>
}

export interface RejectDraft {
  reasonId: string | null
  note: string
}

export interface CampusPrice {
  university: AdCampus
  price_per_thousand: Money
  custom: boolean
}

export type PriceListQuery = {
  page: number
  perPage: number
  q?: string
}

export interface CreateAdReasonInput {
  slug: string
  label: string
  description: string
  prohibited?: boolean
  position?: number
}

export type UpdateAdReasonInput = Partial<CreateAdReasonInput> & {
  retired?: boolean
}

export interface AdReasonDraft {
  slug: string
  label: string
  description: string
  prohibited: boolean
  position: string
}

export interface AdButton {
  id: string
  slug: string
  label: string
  position: number
  retired: boolean
  created_at: string
}

export interface CreateAdButtonInput {
  slug: string
  label: string
  position?: number
}

export type UpdateAdButtonInput = Partial<CreateAdButtonInput> & {
  retired?: boolean
}

export interface AdButtonDraft {
  slug: string
  label: string
  position: string
}
