export type CampusStatus = "verified" | "pending" | "rejected"

export interface University {
  id: string
  name: string
  acronym: string
  slug: string
  country_code: string
  status: CampusStatus
  motto: string | null
  website: string | null
  logo_url: string | null
}

export interface CampusChoice extends University {
  open: boolean
}

/** The short form a person carries around: enough to name and link their campus. */
export interface UniversityBadge {
  id: string
  name: string
  acronym: string
  slug: string
}
