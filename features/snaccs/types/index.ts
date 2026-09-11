import type { LiveMatch, SnaccMatch } from "@/features/football/types"
import type { Gif } from "@/features/giphy/types"
import type { DraftSticker, StickerAttachment } from "@/features/stickers/types"
import type { UniversityBadge } from "@/features/universities/types"
import type { Author } from "@/features/users/types"
import type { VoiceDraft } from "@/features/voice/types"
import type { PickedImage } from "@/lib/media"

export type SnaccAuthorUniversity = UniversityBadge

export type SnaccAuthor = Author

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

export type QuotedGone = "deleted" | "unavailable"

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
  quoted_gone: QuotedGone | null
  comments_count: number
  resnaccs_count: number
  views_count: number
}

export type EmbeddedSnacc = Omit<Snacc, "resnacc_of" | "quoted_gone">

/** An embedded snacc that may still carry what it quotes, as a full one does. */
export type GlimpsedSnacc = EmbeddedSnacc & {
  resnacc_of?: EmbeddedSnacc | null
}

export interface SnaccWithParent extends Snacc {
  parent: EmbeddedSnacc | null
}

export type ResnaccTab = "quotes" | "people"

export interface PollGalleryImage {
  url: string
  width: number
  height: number
}

export interface CreateSnaccInput {
  id: string
  body?: string
  images?: PickedImage[]
  giphyId?: string
  stickerId?: string
  matchId?: string
  parentId?: string
  resnaccOfId?: string
  poll?: PollPayload
  spoiler?: boolean
  voice?: VoiceDraft
}

export interface EditSnaccInput {
  id: string
  body?: string
  keepImageIds: string[]
  images: PickedImage[]
  giphyId?: string
  stickerId?: string
  spoiler?: boolean
}

export interface ReactToSnaccInput {
  snaccId: string
  emoji: string | null
}

export interface PollPayload {
  options: string[]
  images?: PickedImage[]
  durationMinutes: number
}

/** Everything the composer hands over to post, before the snacc has an id. */
export interface SnaccDraft {
  body: string | null
  images: PickedImage[]
  gif: Gif | null
  sticker: DraftSticker | null
  /** The fixture the composer was opened for; sent even before its card has loaded. */
  matchId?: string
  match: LiveMatch | null
  voice: VoiceDraft | null
  parentId?: string
  resnaccOfId?: string
  poll?: PollPayload
  spoiler: boolean
  anonymous: boolean
}

export type ComposerMode = "reply" | "quote" | "new"

export interface ComposeParams {
  parentId?: string
  resnaccOfId?: string
  initialBody?: string
  matchId?: string
  draftId?: string
}

export type DraftImage =
  | { kind: "kept"; id: string; url: string; width: number; height: number }
  | { kind: "picked"; asset: PickedImage }

export interface PollOptionDraft {
  text: string
  image: PickedImage | null
}

export type PollDurationPart = "days" | "hours" | "minutes"

export interface PollDraft {
  options: PollOptionDraft[]
  days: number
  hours: number
  minutes: number
}

/** What a composer starts from: empty, a stored draft, or the snacc being edited. */
export interface DraftSeed {
  body: string
  images: DraftImage[]
  gif: Gif | null
  spoiler: boolean
  sticker?: DraftSticker | null
  voice?: VoiceDraft | null
  poll?: PollDraft | null
  storedVoice?: SnaccVoiceNote | null
}

export interface TypeaheadSuggestion {
  key: string
  label: string
  hint: string | null
  avatarUrl: string | null
  replacement: string
}

export interface ActiveToken {
  kind: "hashtag" | "mention"
  term: string
  start: number
  end: number
}

export interface StoredDraftImage {
  blob: Blob
  width: number
  height: number
  mimeType: string
  fileName: string
}

export interface StoredVoice {
  blob: Blob
  mimeType: string
  durationMs: number
}

export interface StoredPollDraft {
  options: { text: string; image: StoredDraftImage | null }[]
  days: number
  hours: number
  minutes: number
}

export interface StoredDraft {
  id: string
  saved_at: string
  parentId?: string
  resnaccOfId?: string
  body: string
  spoiler: boolean
  images: StoredDraftImage[]
  voice: StoredVoice | null
  gif: Gif | null
  sticker: DraftSticker | null
  poll: StoredPollDraft | null
}

export type DraftContent = Omit<StoredDraft, "id" | "saved_at">

export type DraftThumb = { url: string } | { blob: Blob } | null
