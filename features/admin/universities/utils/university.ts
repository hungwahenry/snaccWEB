import type { Option } from "@/features/admin/shell/types"
import type { Country, CountryPlaces } from "@/features/places/types"
import { regionPath } from "@/features/places/utils/regions"
import type {
  AdminUniversity,
  CreateUniversityInput,
  UniversityDraft,
  UpdateUniversityInput,
} from "../types"

export const UNIVERSITY_LIMITS = {
  name: 200,
  slug: 100,
  acronym: 20,
  motto: 200,
  website: 300,
  logoUrl: 500,
} as const

/** Every campus as a choice in a picker, alphabetically. */
export function campusOptions(universities: AdminUniversity[]): Option[] {
  return [...universities]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((university) => ({
      value: university.id,
      label: `${university.name} (${university.acronym})`,
    }))
}

export function acronymsById(
  universities: AdminUniversity[]
): ReadonlyMap<string, string> {
  return new Map(
    universities.map((university) => [university.id, university.acronym])
  )
}

const UNSET: Option = { value: "unset", label: "Not set" }

export const TIME_ZONE_OPTIONS: Option[] = Intl.supportedValuesOf(
  "timeZone"
).map((zone) => ({ value: zone, label: zone.replaceAll("_", " ") }))

export function countryOptions(countries: Country[]): Option[] {
  return countries.map((country) => ({
    value: country.code,
    label: country.name,
  }))
}

export function regionChoices(places: CountryPlaces | undefined): Option[] {
  const regions = places?.regions ?? []
  const options = regions
    .map((region) => ({
      value: region.id,
      label: regionPath(regions, region.id),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return [UNSET, ...options]
}

export function campusTypeChoices(places: CountryPlaces | undefined): Option[] {
  return [
    UNSET,
    ...(places?.campus_types ?? []).map((type) => ({
      value: type.id,
      label: type.name,
    })),
  ]
}

export function universityPlace(
  university: Pick<AdminUniversity, "country" | "region" | "campus_type">
): string {
  return [
    university.region?.name,
    university.campus_type?.name,
    university.country.name,
  ]
    .filter((part): part is string => Boolean(part))
    .join(" · ")
}

export function draftFrom(university?: AdminUniversity): UniversityDraft {
  return {
    name: university?.name ?? "",
    slug: university?.slug ?? "",
    acronym: university?.acronym ?? "",
    motto: university?.motto ?? "",
    website: university?.website ?? "",
    logoUrl: university?.logo_url ?? "",
    countryCode: university?.country.code ?? "",
    regionId: university?.region?.id ?? UNSET.value,
    campusTypeId: university?.campus_type?.id ?? UNSET.value,
    timeZone: university?.time_zone ?? "",
  }
}

export function withCountry(
  draft: UniversityDraft,
  countryCode: string
): UniversityDraft {
  if (draft.countryCode === countryCode) return draft
  return {
    ...draft,
    countryCode,
    regionId: UNSET.value,
    campusTypeId: UNSET.value,
  }
}

export function isDraftReady(
  draft: UniversityDraft,
  editing: boolean
): boolean {
  return (
    draft.name.trim() !== "" &&
    draft.acronym.trim() !== "" &&
    draft.countryCode !== "" &&
    draft.timeZone !== "" &&
    (editing || draft.slug.trim() !== "")
  )
}

function placeOf(choice: string): string | null {
  return choice === UNSET.value ? null : choice
}

function placeInput(draft: UniversityDraft) {
  return {
    countryCode: draft.countryCode,
    regionId: placeOf(draft.regionId),
    campusTypeId: placeOf(draft.campusTypeId),
    timeZone: draft.timeZone,
  }
}

export function toUpdateInput(draft: UniversityDraft): UpdateUniversityInput {
  return {
    name: draft.name.trim(),
    acronym: draft.acronym.trim(),
    motto: draft.motto.trim(),
    website: draft.website.trim(),
    logoUrl: draft.logoUrl.trim(),
    ...placeInput(draft),
  }
}

export function toCreateInput(draft: UniversityDraft): CreateUniversityInput {
  return {
    name: draft.name.trim(),
    slug: draft.slug.trim().toLowerCase(),
    acronym: draft.acronym.trim(),
    motto: draft.motto.trim() || undefined,
    website: draft.website.trim() || undefined,
    logoUrl: draft.logoUrl.trim() || undefined,
    ...placeInput(draft),
  }
}
