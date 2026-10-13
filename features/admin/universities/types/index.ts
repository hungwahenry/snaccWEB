import type { NamedPlace } from "@/features/places/types"
import type { CampusStatus } from "@/features/universities/types"
import type { Money } from "@/lib/money"

export type { CampusStatus }

export interface AdminUniversity {
  id: string
  name: string
  acronym: string
  slug: string
  motto: string | null
  website: string | null
  logo_url: string | null
  country: { code: string; name: string }
  region: NamedPlace | null
  campus_type: NamedPlace | null
  time_zone: string
  open: boolean
  status: CampusStatus
  ror_id: string | null
  domains: string[]
  added_by: { id: string; username: string | null } | null
  created_at: string
  stats: { profiles: number; snaccs: number }
  fund: { cap: Money; distributed: Money } | null
}

export type UniversityListQuery = {
  page: number
  perPage: number
  q?: string
  status?: CampusStatus
  country?: string
}

export interface CreateUniversityInput {
  name: string
  slug: string
  acronym: string
  motto?: string
  website?: string
  logoUrl?: string
  countryCode: string
  regionId: string | null
  campusTypeId: string | null
  timeZone: string
  open: boolean
}

export type UpdateUniversityInput = Omit<CreateUniversityInput, "slug">

export interface UniversityDraft {
  name: string
  slug: string
  acronym: string
  motto: string
  website: string
  logoUrl: string
  countryCode: string
  regionId: string
  campusTypeId: string
  timeZone: string
  open: boolean
}
