export interface AdminAnnouncement {
  id: string
  title: string
  message: string
  university_id: string | null
  created_at: string
}

export interface ListAnnouncementsParams {
  page?: number
  perPage?: number
}

export interface CreateAnnouncementInput {
  title: string
  message: string
  audience: "all" | "campus"
  universityId?: string
}
