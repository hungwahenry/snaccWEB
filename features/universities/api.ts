import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AdminUniversity, CreateUniversityInput, UpdateUniversityInput } from "./types"

export async function listUniversities() {
  const page = await api.get<Paginated<AdminUniversity>>("/admin/universities", { perPage: 100 })
  return page.items
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
