export type NigerianState =
  | "abia"
  | "adamawa"
  | "akwa_ibom"
  | "anambra"
  | "bauchi"
  | "bayelsa"
  | "benue"
  | "borno"
  | "cross_river"
  | "delta"
  | "ebonyi"
  | "edo"
  | "ekiti"
  | "enugu"
  | "gombe"
  | "imo"
  | "jigawa"
  | "kaduna"
  | "kano"
  | "katsina"
  | "kebbi"
  | "kogi"
  | "kwara"
  | "lagos"
  | "nasarawa"
  | "niger"
  | "ogun"
  | "ondo"
  | "osun"
  | "oyo"
  | "plateau"
  | "rivers"
  | "sokoto"
  | "taraba"
  | "yobe"
  | "zamfara"
  | "fct"

export type UniversityOwnership = "federal" | "state" | "private"

export type StateChoice = NigerianState | "unset"

export type OwnershipChoice = UniversityOwnership | "unset"

export interface AdminUniversity {
  id: string
  name: string
  acronym: string
  slug: string
  motto: string | null
  website: string | null
  logo_url: string | null
  state: NigerianState | null
  ownership: UniversityOwnership | null
  stats: { profiles: number; snaccs: number }
  fund: { cap: number; distributed: number } | null
}

export type UniversityListQuery = {
  page: number
  perPage: number
  q?: string
}

export interface CreateUniversityInput {
  name: string
  slug: string
  acronym: string
  motto?: string
  website?: string
  logoUrl?: string
  state?: NigerianState | null
  ownership?: UniversityOwnership | null
}

export type UpdateUniversityInput = Partial<Omit<CreateUniversityInput, "slug">>

export interface UniversityDraft {
  name: string
  slug: string
  acronym: string
  motto: string
  website: string
  logoUrl: string
  state: StateChoice
  ownership: OwnershipChoice
}
