export interface AdminAnnouncement {
  id: string
  title: string
  message: string
  university_id: string | null
  created_at: string
}

export type AnnouncementListQuery = {
  page: number
  perPage: number
  q?: string
}

export type AnnouncementAudience = "all" | "campus"

export interface CreateAnnouncementInput {
  title: string
  message: string
  audience: AnnouncementAudience
  universityId?: string
}

export interface AnnouncementDraft {
  title: string
  message: string
  audience: AnnouncementAudience
  universityId: string | null
}
