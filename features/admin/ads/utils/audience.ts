import { PLATFORM_LABELS } from "@/features/admin/announcements/utils/audience"
import type {
  AdAudience,
  AdFact,
  AdGender,
  AdPlacement,
  AdStanding,
} from "../types"

export const PLACEMENT_LABELS: Record<AdPlacement, string> = {
  feed: "Home feed",
  clips: "Clips",
  discover: "Discover",
  lists: "Campus, hashtag and search lists",
}

const GENDER_LABELS: Record<AdGender, string> = {
  male: "Men",
  female: "Women",
  non_binary: "Non-binary",
  prefer_not_to_say: "Prefer not to say",
}

const STANDING_LABELS: Record<AdStanding, string> = {
  any: "Students and graduates",
  students: "Students only",
  graduates: "Graduates only",
}

function listOr(values: string[], fallback: string): string {
  return values.length > 0 ? values.join(", ") : fallback
}

export function graduationLine(from: number | null, to: number | null): string {
  if (from !== null && to !== null) {
    return from === to ? String(from) : `${from}–${to}`
  }
  if (from !== null) return `${from} or later`
  if (to !== null) return `${to} or earlier`

  return "Any year"
}

export function joinedLine(days: number | null): string {
  if (days === null) return "Any time"

  return days === 1 ? "In the last day" : `In the last ${days} days`
}

export function audienceFacts(audience: AdAudience): AdFact[] {
  return [
    { label: "Country", value: audience.country.name },
    {
      label: "Campuses",
      value: listOr(
        audience.campuses.map((campus) => campus.acronym),
        "Any campus"
      ),
    },
    {
      label: "Regions",
      value: listOr(
        audience.regions.map((region) => region.name),
        "Anywhere in the country"
      ),
    },
    {
      label: "Campus types",
      value: listOr(
        audience.campus_types.map((type) => type.name),
        "Any"
      ),
    },
    {
      label: "Gender",
      value: listOr(
        audience.genders.map((gender) => GENDER_LABELS[gender]),
        "Anyone"
      ),
    },
    {
      label: "Graduation year",
      value: graduationLine(audience.graduation_from, audience.graduation_to),
    },
    {
      label: "Students or graduates",
      value: STANDING_LABELS[audience.standing],
    },
    {
      label: "Platforms",
      value: listOr(
        audience.platforms.map((platform) => PLATFORM_LABELS[platform]),
        "Every platform"
      ),
    },
    { label: "Joined", value: joinedLine(audience.joined_within_days) },
    {
      label: "Interested in",
      value: listOr(
        audience.hashtags.map((tag) => `#${tag}`),
        "Anything"
      ),
    },
  ]
}

export function placementsLine(placements: AdPlacement[]): string {
  return listOr(
    placements.map((placement) => PLACEMENT_LABELS[placement]),
    "Nowhere"
  )
}
