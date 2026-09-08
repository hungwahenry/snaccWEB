import type { SnaccAuthor } from "@/features/snaccs/types"
import type { StickerAttachment } from "@/features/stickers/types"

export type MessageParty = SnaccAuthor

export interface VoiceNote {
  id: string
  url: string
  duration_ms: number
}

export interface MessageImage {
  id: string
  url: string | null
  thumb_url: string | null
  width: number
  height: number
  position: number
  view_once: boolean
  opened: boolean
  available: boolean
}

export type ShownImage = MessageImage & { url: string }

export interface OpenedPhoto {
  url: string
  expires_at: string
}

export interface ReplyPreview {
  id: string
  body: string | null
  removed: boolean
  mine: boolean
  has_images: boolean
  has_sticker: boolean
  has_gif: boolean
  has_voice: boolean
  money: { kind: "sent" | "request"; amount: number } | null
}

export interface QuotedMoment {
  id: string | null
  expired: boolean
  body: string | null
  background: string | null
  image_url: string | null
}

export interface MessageReaction {
  emoji: string
  mine: boolean
}

export type MessageStatus = "sending" | "failed"

export interface MessageGif {
  giphy_id: string
  url: string
  preview_url: string | null
  width: number
  height: number
}

export interface MessageMoney {
  kind: "sent" | "request"
  amount: number
  transaction_id: string | null
  request: { id: string; status: string } | null
}

export interface Message {
  id: string
  status?: MessageStatus
  body: string | null
  removed: boolean
  deleted_by_sender: boolean
  edited: boolean
  mine: boolean
  created_at: string
  reply_to: ReplyPreview | null
  reactions: MessageReaction[]
  images: MessageImage[]
  voice: VoiceNote | null
  sticker: StickerAttachment | null
  gif: MessageGif | null
  money: MessageMoney | null
  moment: QuotedMoment | null
}

export interface Conversation {
  id: string
  other: MessageParty
  you_are_ghost: boolean
  revealed: boolean
  can_reveal: boolean
  blocked: boolean
  has_unread: boolean
  peer_read_at: string | null
  last_message: Message | null
  streak: number
  last_message_at: string
  created_at: string
}

export interface MessageHit {
  conversation: Conversation
  message: Message
}

export interface MessageSettings {
  accept?: boolean
}
