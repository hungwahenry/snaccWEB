import { api } from "@/lib/api/client"
import type { AdminEgg, CreateEggInput, UpdateEggInput } from "../types"

export function listEggs() {
  return api.get<AdminEgg[]>("/admin/easter-eggs")
}

export function createEgg(input: CreateEggInput) {
  return api.post<AdminEgg>("/admin/easter-eggs", input)
}

export function updateEgg(id: string, input: UpdateEggInput) {
  return api.patch<AdminEgg>(`/admin/easter-eggs/${id}`, input)
}

export function deleteEgg(id: string) {
  return api.del<null>(`/admin/easter-eggs/${id}`)
}

export function uploadEggImage(id: string, file: File) {
  const form = new FormData()
  form.append("image", file)
  return api.upload<AdminEgg>(`/admin/easter-eggs/${id}/image`, form)
}

export function removeEggImage(id: string) {
  return api.del<AdminEgg>(`/admin/easter-eggs/${id}/image`)
}
