import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminAnnouncement,
  AnnouncementListQuery,
  AnnouncementReach,
  AudienceInput,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "../types"

export function listAnnouncements(query: AnnouncementListQuery) {
  return api.get<Paginated<AdminAnnouncement>>("/admin/announcements", query)
}

export function getAnnouncement(id: string) {
  return api.get<AdminAnnouncement>(`/admin/announcements/${id}`)
}

export function countReach(audience: AudienceInput) {
  return api.post<AnnouncementReach>("/admin/announcements/reach", audience)
}

export function createAnnouncement(input: CreateAnnouncementInput) {
  return api.post<AdminAnnouncement>("/admin/announcements", input)
}

export function updateAnnouncement(id: string, input: UpdateAnnouncementInput) {
  return api.patch<AdminAnnouncement>(`/admin/announcements/${id}`, input)
}

export function uploadAnnouncementImage(id: string, file: File) {
  const form = new FormData()
  form.append("image", file)

  return api.upload<AdminAnnouncement>(`/admin/announcements/${id}/image`, form)
}

export function removeAnnouncementImage(id: string) {
  return api.del<AdminAnnouncement>(`/admin/announcements/${id}/image`)
}

export function setAnnouncementImportant(id: string, important: boolean) {
  return api.put<AdminAnnouncement>(`/admin/announcements/${id}/important`, {
    important,
  })
}

export function testAnnouncement(id: string) {
  return api.post<null>(`/admin/announcements/${id}/test`)
}

export function sendAnnouncement(id: string, at?: string) {
  return api.post<AdminAnnouncement>(
    `/admin/announcements/${id}/send`,
    at ? { at } : {}
  )
}

export function unscheduleAnnouncement(id: string) {
  return api.post<AdminAnnouncement>(`/admin/announcements/${id}/unschedule`)
}

export function deleteAnnouncement(id: string) {
  return api.del<null>(`/admin/announcements/${id}`)
}
