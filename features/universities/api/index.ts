import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { University } from "@/features/universities/types"

export interface ListUniversitiesParams {
  search?: string
  country?: string
  page?: number
  perPage?: number
  verified?: boolean
}

export interface NewCampus {
  name: string
  acronym?: string
  timeZone?: string
}

export function listUniversities(
  params: ListUniversitiesParams = {}
): Promise<Paginated<University>> {
  return api.get<Paginated<University>>("/universities", { ...params })
}

export function addCampus(campus: NewCampus): Promise<University> {
  return api.post<University>("/universities", campus)
}
