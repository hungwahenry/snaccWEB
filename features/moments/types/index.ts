import type { EmbeddedSnacc, Snacc } from "@/features/snaccs/types"
import type { SnaccAuthor } from "@/features/snaccs/types"

export type MomentMode = "text" | "image" | "snacc"

export interface MomentImage {
  id: string
  url: string
  width: number
  height: number
}

export interface Moment {
  id: string
  author: SnaccAuthor
  mine: boolean
  body: string | null
  background: string | null
  image: MomentImage | null
  snacc: EmbeddedSnacc | null
  snacc_gone: Snacc["quoted_gone"]
  views_count: number
  seen: boolean
  created_at: string
  expires_at: string
  held: boolean
  liked: boolean
}

export interface MomentViewer extends SnaccAuthor {
  viewed_at: string
  liked: boolean
}

export interface TrayEntry {
  author: SnaccAuthor
  mine: boolean
  total: number
  unseen: number
  latest_at: string
  next_expiry_at: string
}
