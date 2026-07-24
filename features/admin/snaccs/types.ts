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
  reports_count: number
}

export interface ListSnaccsParams {
  page?: number
  perPage?: number
  q?: string
  authorId?: string
  universityId?: string
  deleted?: boolean
}
