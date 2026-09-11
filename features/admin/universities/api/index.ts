import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminUniversity,
  CreateUniversityInput,
  UniversityListQuery,
  UpdateUniversityInput,
} from "../types"

const MAX_PER_PAGE = 100

export function listUniversities(query: UniversityListQuery) {
  return api.get<Paginated<AdminUniversity>>("/admin/universities", query)
}

export async function listAllUniversities(): Promise<AdminUniversity[]> {
  const first = await listUniversities({ page: 1, perPage: MAX_PER_PAGE })
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.last_page - 1) }, (_, index) =>
      listUniversities({ page: index + 2, perPage: MAX_PER_PAGE })
    )
  )

  return [first, ...rest].flatMap((page) => page.items)
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
