export interface AdminUniversity {
  id: string
  name: string
  acronym: string
  slug: string
  motto: string | null
  website: string | null
  logo_url: string | null
  stats: { profiles: number; snaccs: number }
  fund: { cap: number; distributed: number } | null
}

export interface CreateUniversityInput {
  name: string
  slug: string
  acronym: string
  motto?: string
  website?: string
  logoUrl?: string
}

export interface UpdateUniversityInput {
  name?: string
  acronym?: string
  motto?: string
  website?: string
  logoUrl?: string
}
