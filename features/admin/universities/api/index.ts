import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminUniversity,
  CreateUniversityInput,
  ListUniversitiesParams,
  UpdateUniversityInput,
} from "../types"

const MAX_PER_PAGE = 100

export function listUniversities(params: ListUniversitiesParams) {
  return api.get<Paginated<AdminUniversity>>(
    "/admin/universities",
    params as QueryParams
  )
}

export async function listAllUniversities(): Promise<AdminUniversity[]> {
  const first = await listUniversities({ page: 1, perPage: MAX_PER_PAGE })
  const items = [...first.items]

  for (let page = 2; page <= first.last_page; page += 1) {
    const next = await listUniversities({ page, perPage: MAX_PER_PAGE })
    items.push(...next.items)
  }

  return items
}

export function createUniversity(input: CreateUniversityInput) {
  return api.post<AdminUniversity>("/admin/universities", input)
}

export function updateUniversity(id: string, input: UpdateUniversityInput) {
  return api.patch<AdminUniversity>(`/admin/universities/${id}`, input)
}

export function deleteUniversity(id: string) {
  return api.del<null>(`/admin/universities/${id}`)
}
