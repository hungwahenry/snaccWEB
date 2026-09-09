import type { SnaccMatch } from "@/features/football/types"
import type { UserScore } from "@/features/score/types"
import type { StickerAttachment } from "@/features/stickers/types"

export interface SnaccAuthorUniversity {
  id: string
  name: string
  acronym: string
  slug: string
}

export interface SnaccAuthor {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: SnaccAuthorUniversity | null
  score: UserScore
  official: boolean
  is_birthday: boolean
}

export interface SnaccMentionUser {
  id: string
  username: string | null
  display_name: string | null
  tier: string | null
}

export type SnaccEntity =
  | { type: "hashtag"; start: number; length: number; tag: string }
  | { type: "mention"; start: number; length: number; user: SnaccMentionUser }

export interface SnaccPollOptionImage {
  url: string
  thumb_url: string
  width: number
  height: number
}

export interface SnaccPollOption {
  id: string
  label: string
  votes_count: number | null
  image: SnaccPollOptionImage | null
}

export interface SnaccPoll {
  id: string
  closes_at: string
  closed: boolean
  total_votes: number | null
  my_option_id: string | null
  options: SnaccPollOption[]
}

export interface SnaccVoiceNote {
  id: string
  url: string
  duration_ms: number
}

export interface SnaccImage {
  id: string
  url: string
  thumb_url: string
  width: number
  height: number
  position: number
}

export interface SnaccGif {
  giphy_id: string
  url: string
  preview_url: string | null
  width: number
  height: number
}

export interface SnaccReaction {
  emoji: string
  count: number
}

export interface SnaccReactor {
  emoji: string
  reacted_at: string
  user: SnaccAuthor
}

export interface SnaccResnaccer {
  resnacced_at: string
  user: SnaccAuthor
}

export interface ResnaccSummary {
  quotes: number
  plain: number
}

export type CommentSort = "relevant" | "top" | "newest" | "oldest"

export interface SnaccReplyTo {
  id: string
  username: string | null
  anonymous: boolean
}

export type SnaccStatus = "sending" | "failed"

export interface Snacc {
  id: string
  parent_id: string | null
  status?: SnaccStatus
  reply_to_user: SnaccReplyTo | null
  resnacc_of: EmbeddedSnacc | null
  my_resnacc: boolean
  mine: boolean
  body: string | null
  anonymous: boolean
  spoiler: boolean
  expires_at: string | null
  created_at: string
  edited_at: string | null
  author: SnaccAuthor
  entities: SnaccEntity[]
  images: SnaccImage[]
  voice: SnaccVoiceNote | null
  poll: SnaccPoll | null
  gif: SnaccGif | null
  match: SnaccMatch | null
  sticker: StickerAttachment | null
  reactions: SnaccReaction[]
  reactions_count: number
  my_reaction: string | null
  saved: boolean
  pinned: boolean
  held: boolean
  quoted_gone: "deleted" | "unavailable" | null
  comments_count: number
  resnaccs_count: number
  views_count: number
}

export type EmbeddedSnacc = Omit<Snacc, "resnacc_of" | "quoted_gone">

export interface SnaccWithParent extends Snacc {
  parent: EmbeddedSnacc | null
}
