import type { UserRefWithCampus } from "@/lib/api/types"
import type { ReportFiling } from "@/features/admin/reports/types"
import type {
  MediaGif,
  MediaImage,
  MediaSticker,
  MediaVoice,
} from "@/features/admin/shell/types"

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

export interface AdminSnaccDetail extends AdminSnacc {
  reports: ReportFiling[]
}

export type SnaccListQuery = {
  page: number
  perPage: number
  q?: string
  deleted?: boolean
}

export type SnaccState = "live" | "deleted"

/** Everything an admin can do to one snacc. Each resolves once the page shows the result. */
export interface SnaccActions {
  remove: (id: string, reason?: string) => Promise<unknown>
  hold: (id: string) => Promise<unknown>
  release: (id: string) => Promise<unknown>
  pin: (id: string) => Promise<unknown>
  unpin: (id: string) => Promise<unknown>
}
