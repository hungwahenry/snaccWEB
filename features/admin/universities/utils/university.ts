import type { Option } from "@/features/admin/shell/types"
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

export function draftFrom(university?: AdminUniversity): UniversityDraft {
  return {
    name: university?.name ?? "",
    slug: university?.slug ?? "",
    acronym: university?.acronym ?? "",
    motto: university?.motto ?? "",
    website: university?.website ?? "",
    logoUrl: university?.logo_url ?? "",
  }
}

export function isDraftReady(
  draft: UniversityDraft,
  editing: boolean
): boolean {
  return (
    draft.name.trim() !== "" &&
    draft.acronym.trim() !== "" &&
    (editing || draft.slug.trim() !== "")
  )
}

export function toUpdateInput(draft: UniversityDraft): UpdateUniversityInput {
  return {
    name: draft.name.trim(),
    acronym: draft.acronym.trim(),
    motto: draft.motto.trim(),
    website: draft.website.trim(),
    logoUrl: draft.logoUrl.trim(),
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
  }
}
