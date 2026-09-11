import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { Snacc } from "@/features/snaccs/types"
import type { UniversityDetail } from "../types"

export function getUniversity(slug: string): Promise<UniversityDetail> {
  return api.get<UniversityDetail>(`/universities/${encodeURIComponent(slug)}`)
}

export function listCampusSnaccs(
  slug: string,
  page: number
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>(
    `/universities/${encodeURIComponent(slug)}/snaccs`,
    { page }
  )
}
