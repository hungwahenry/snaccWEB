import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AdminAnnouncement, CreateAnnouncementInput, ListAnnouncementsParams } from "./types"

export function listAnnouncements(params: ListAnnouncementsParams) {
  return api.get<Paginated<AdminAnnouncement>>("/admin/announcements", params as QueryParams)
}

export function createAnnouncement(input: CreateAnnouncementInput) {
  return api.post<AdminAnnouncement>("/admin/announcements", input)
}

export function deleteAnnouncement(id: string) {
  return api.del<null>(`/admin/announcements/${id}`)
}
