import type { MentionEntity } from "@/features/users/types"
import type {
  EmbeddedSnacc,
  QuotedGone,
  SnaccAuthor,
} from "@/features/snaccs/types"

export type MomentMode = "text" | "image" | "snacc"

export type ChosenMode = Exclude<MomentMode, "snacc">

export interface MomentSharing {
  snaccId: string
  ready: boolean
}

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
  entities: MentionEntity[]
  background: string | null
  image: MomentImage | null
  snacc: EmbeddedSnacc | null
  snacc_gone: QuotedGone | null
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
