import type { UserRef } from "@/lib/api/types"

export type MomentRow = {
  id: string
  body: string | null
  background: string | null
  image_url: string | null
  author: UserRef | null
  views_count: number
  reports_count: number
  held_at: string | null
  deleted_at: string | null
  expires_at: string
  created_at: string
}

export type MomentListQuery = {
  page: number
  perPage: number
  q?: string
  held?: boolean
  deleted?: boolean
}
