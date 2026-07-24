import { serverGet } from "@/lib/api/server"

export interface PublicCampus {
  id: string
  name: string
  acronym: string
  slug: string
  motto: string | null
  logo_url: string | null
  members_count: number
  snaccs_count: number
}

export function getPublicCampus(slug: string) {
  return serverGet<PublicCampus>(`/universities/${encodeURIComponent(slug)}`)
}
