import { api } from "@/lib/api/client"
import type { AdminPage, CreatePageInput, PageStatus, UpdatePageInput } from "./types"

export function listPages() {
  return api.get<AdminPage[]>("/admin/pages")
}

export function getPage(id: string) {
  return api.get<AdminPage>(`/admin/pages/${id}`)
}

export function createPage(input: CreatePageInput) {
  return api.post<AdminPage>("/admin/pages", input)
}

export function updatePage(id: string, input: UpdatePageInput) {
  return api.patch<AdminPage>(`/admin/pages/${id}`, input)
}

export function setPageStatus(id: string, status: PageStatus) {
  return api.post<AdminPage>(`/admin/pages/${id}/status`, { status })
}

export function deletePage(id: string) {
  return api.del<null>(`/admin/pages/${id}`)
}
