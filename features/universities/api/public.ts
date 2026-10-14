import { serverGet } from "@/lib/api/server"
import type { Paginated } from "@/lib/api/types"
import type { University } from "../types"

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

export async function countCampuses(): Promise<number | null> {
  const page = await serverGet<Paginated<University>>(
    "/universities?open=true&perPage=1"
  ).catch(() => null)
  return page?.total ?? null
}
