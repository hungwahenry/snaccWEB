import type { UserRefWithCampus } from "@/lib/api/types"
import type { ReportFiling } from "@/features/admin/reports/types"
import type {
  MediaGif,
  MediaImage,
  MediaSticker,
  MediaVoice,
} from "@/components/admin/content-media"

export type SnaccAuthor = UserRefWithCampus

export interface SnaccContent {
  id: string
  body: string | null
  created_at: string
  edited_at: string | null
  anonymous: boolean
  spoiler: boolean
  author: SnaccAuthor
  images: MediaImage[]
  gif: MediaGif | null
  sticker: MediaSticker | null
  voice: MediaVoice | null
}

export interface AdminSnacc extends SnaccContent {
  parent_id: string | null
  resnacc_of: SnaccContent | null
  reactions_count: number
  comments_count: number
  resnaccs_count: number
  views_count: number
  pinned: boolean
  deleted_at: string | null
  held_at: string | null
  reports_count: number
}

export interface ListSnaccsParams {
  page?: number
  perPage?: number
  q?: string
  authorId?: string
  universityId?: string
  deleted?: boolean
  held?: boolean
}

export interface AdminSnaccDetail extends AdminSnacc {
  reports: ReportFiling[]
}
