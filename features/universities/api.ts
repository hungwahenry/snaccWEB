import { api } from "@/lib/api/client"
import type { AdminUniversity, CreateUniversityInput, UpdateUniversityInput } from "./types"

export function listUniversities() {
  return api.get<AdminUniversity[]>("/admin/universities")
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
