export interface SnaccAuthor {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: { id: string; name: string; acronym: string } | null
}

export interface AdminSnacc {
  id: string
  body: string | null
  created_at: string
  author: SnaccAuthor
  images: { url: string }[]
  gif: { url: string } | null
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
