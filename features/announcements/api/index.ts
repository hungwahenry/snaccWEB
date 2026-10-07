import { api } from "@/lib/api/client"
import type {
  Announcement,
  AnnouncementBanner,
  AnnouncementEvent,
} from "../types"

export const getAnnouncementBanner = () =>
  api.get<AnnouncementBanner | null>("/announcements/banner")

export const getAnnouncement = (id: string) =>
  api.get<Announcement>(`/announcements/${id}`)

export const recordAnnouncementEvent = ({ id, ...event }: AnnouncementEvent) =>
  api.post<null>(`/announcements/${id}/events`, event)
