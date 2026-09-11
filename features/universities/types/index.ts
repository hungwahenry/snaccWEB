export interface University {
  id: string
  name: string
  acronym: string
  slug: string
  motto: string | null
  website: string | null
  logo_url: string | null
}

/** The short form a person carries around: enough to name and link their campus. */
export interface UniversityBadge {
  id: string
  name: string
  acronym: string
  slug: string
}
