import type { Option } from "@/features/admin/shell/types"
import type {
  AdminUniversity,
  CreateUniversityInput,
  NigerianState,
  OwnershipChoice,
  StateChoice,
  UniversityDraft,
  UniversityOwnership,
  UpdateUniversityInput,
} from "../types"
import { STATE_OPTIONS, stateName } from "./states"

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

const OWNERSHIPS = [
  "federal",
  "state",
  "private",
] as const satisfies readonly UniversityOwnership[]

export const OWNERSHIP_LABELS: Record<UniversityOwnership, string> = {
  federal: "Federal",
  state: "State",
  private: "Private",
}

const OWNERSHIP_OPTIONS: Option<UniversityOwnership>[] = OWNERSHIPS.map(
  (ownership) => ({ value: ownership, label: OWNERSHIP_LABELS[ownership] })
)

const UNSET = { value: "unset", label: "Not set" } as const

export const STATE_CHOICES: Option<StateChoice>[] = [UNSET, ...STATE_OPTIONS]

export const OWNERSHIP_CHOICES: Option<OwnershipChoice>[] = [
  UNSET,
  ...OWNERSHIP_OPTIONS,
]

function stateOf(choice: StateChoice): NigerianState | null {
  return choice === "unset" ? null : choice
}

function ownershipOf(choice: OwnershipChoice): UniversityOwnership | null {
  return choice === "unset" ? null : choice
}

export function universityPlace(
  university: Pick<AdminUniversity, "state" | "ownership">
): string {
  const parts = [
    university.state ? stateName(university.state) : null,
    university.ownership ? OWNERSHIP_LABELS[university.ownership] : null,
  ].filter((part): part is string => part !== null)

  return parts.length > 0 ? parts.join(" · ") : "Not set"
}

export function draftFrom(university?: AdminUniversity): UniversityDraft {
  return {
    name: university?.name ?? "",
    slug: university?.slug ?? "",
    acronym: university?.acronym ?? "",
    motto: university?.motto ?? "",
    website: university?.website ?? "",
    logoUrl: university?.logo_url ?? "",
    state: university?.state ?? "unset",
    ownership: university?.ownership ?? "unset",
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
    state: stateOf(draft.state),
    ownership: ownershipOf(draft.ownership),
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
    state: stateOf(draft.state) ?? undefined,
    ownership: ownershipOf(draft.ownership) ?? undefined,
  }
}
