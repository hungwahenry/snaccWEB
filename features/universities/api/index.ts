import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { CampusChoice } from "@/features/universities/types"

export interface ListUniversitiesParams {
  search?: string
  country?: string
  page?: number
  perPage?: number
  verified?: boolean
  id?: string
}

export interface NewCampus {
  name: string
  acronym?: string
  timeZone?: string
}

export function listUniversities(
  params: ListUniversitiesParams = {}
): Promise<Paginated<CampusChoice>> {
  return api.get<Paginated<CampusChoice>>("/universities", { ...params })
}

export function addCampus(campus: NewCampus): Promise<CampusChoice> {
  return api.post<CampusChoice>("/universities", campus)
}
