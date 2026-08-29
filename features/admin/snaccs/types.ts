import type {
  MediaGif,
  MediaImage,
  MediaSticker,
  MediaVoice,
} from "@/components/admin/content-media"

export interface SnaccAuthor {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: { id: string; name: string; acronym: string } | null
}

/** What a snacc carries, as the app serializes it — the admin view shows all of it. */
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
  /** The snacc this one quotes, when it is a resnacc. */
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

/** Detail adds the filings themselves — the reason a moderator opened this page. */
export interface AdminSnaccDetail extends AdminSnacc {
  reports: {
    id: string
    status: "open" | "actioned" | "dismissed"
    detail: string | null
    reason: { slug: string; label: string }
    reporter: SnaccAuthor
    created_at: string
  }[]
}
