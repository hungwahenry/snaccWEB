import type { Gif } from "@/features/giphy/types"
import type { MessageGif, MessageStatus } from "@/features/messages/types"
import type { SnaccReactor } from "@/features/snaccs/types"
import type { DraftSticker, StickerAttachment } from "@/features/stickers/types"
import type { Author } from "@/features/users/types"
import type { VoiceDraft, VoiceNote } from "@/features/voice/types"
import type { PickedImage } from "@/lib/media"

export interface ChatRoomCampus {
  id: string
  name: string
  acronym: string
  slug: string
}

export interface ChatRoom {
  id: string
  name: string
  /** Null marks the room everyone is in. */
  campus: ChatRoomCampus | null
  locked: boolean
  muted: boolean
  unread: number
  last_message_at: string | null
}

export interface ChatImage {
  id: string
  url: string
  thumb_url: string
  width: number
  height: number
  position: number
}

/** One person's reaction, the same shape a snacc lists. */
export type ChatReactor = SnaccReactor

/** One emoji, how many chose it, and whether you are among them. */
export interface ChatReaction {
  emoji: string
  count: number
  mine: boolean
}

export interface ChatReplyPreview {
  id: string
  body: string | null
  sender_username: string | null
  deleted: boolean
  has_images: boolean
  has_sticker: boolean
  has_gif: boolean
  has_voice: boolean
}

export interface ChatMessage {
  id: string
  room_id: string
  /** Set only on your own copy before the server has taken it. */
  status?: MessageStatus
  body: string | null
  created_at: string
  edited: boolean
  mine: boolean
  deleted: boolean
  deleted_by_sender: boolean
  held: boolean
  sender: Author
  images: ChatImage[]
  voice: VoiceNote | null
  sticker: StickerAttachment | null
  gif: MessageGif | null
  reactions: ChatReaction[]
  reply_to: ChatReplyPreview | null
}

/** What the room broadcast carries: counted reactions, and nothing about the reader. */
export interface RoomMessagePayload extends Omit<
  ChatMessage,
  "status" | "mine" | "reactions"
> {
  reactions: { emoji: string; count: number }[]
}

/** What an answer to one person carries on top: which side, and which reaction is theirs. */
export interface ChatMessagePayload extends RoomMessagePayload {
  mine: boolean
  my_reaction: string | null
}

/** What you are sending: the words, what is attached, and what it answers. */
export interface ChatDraft {
  body: string | null
  images: PickedImage[]
  replyingTo: ChatMessage | null
  voice?: VoiceDraft | null
  sticker?: DraftSticker | null
  gif?: Gif | null
}
