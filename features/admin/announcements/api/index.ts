import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminAnnouncement,
  AnnouncementListQuery,
  CreateAnnouncementInput,
} from "../types"

export function listAnnouncements(query: AnnouncementListQuery) {
  return api.get<Paginated<AdminAnnouncement>>("/admin/announcements", query)
}

export function createAnnouncement(input: CreateAnnouncementInput) {
  return api.post<AdminAnnouncement>("/admin/announcements", input)
}

export function deleteAnnouncement(id: string) {
  return api.del<null>(`/admin/announcements/${id}`)
}
