import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { University } from "@/features/universities/types"

export interface ListUniversitiesParams {
  search?: string
  page?: number
  perPage?: number
}

export function listUniversities(
  params: ListUniversitiesParams = {}
): Promise<Paginated<University>> {
  return api.get<Paginated<University>>("/universities", { ...params })
}
