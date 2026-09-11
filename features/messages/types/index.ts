import type { LucideIcon } from "lucide-react"
import type { Gif } from "@/features/giphy/types"
import type { SnaccAuthor } from "@/features/snaccs/types"
import type { DraftSticker, StickerAttachment } from "@/features/stickers/types"
import type { VoiceDraft, VoiceNote } from "@/features/voice/types"
import type { PickedImage } from "@/lib/media"

export type { VoiceNote }

export type MessageParty = SnaccAuthor

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

export type MoneyKind = "sent" | "request"

export interface ReplyPreview {
  id: string
  body: string | null
  removed: boolean
  mine: boolean
  has_images: boolean
  has_sticker: boolean
  has_gif: boolean
  has_voice: boolean
  money: { kind: MoneyKind; amount: number } | null
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
  kind: MoneyKind
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

/** What you have put together in the composer, before it is sent. */
export interface MessageDraft {
  body: string | null
  images: PickedImage[]
  replyingTo: Message | null
  viewOnce?: boolean
  gif?: Gif | null
  sticker?: DraftSticker | null
  voice?: VoiceDraft | null
}

export type DeliveryState = "sent" | "seen"

/** What a thread needs from a message, in a DM or a room. */
export interface ThreadMessage {
  id: string
  mine: boolean
  created_at: string
  status?: MessageStatus
}

export interface ThreadItem<T extends ThreadMessage = Message> {
  message: T
  dayBreak: string | null
  time: string | null
  firstInBurst: boolean
  lastInBurst: boolean
  delivery: DeliveryState | null
}

/** Something a quoted or answered message carries, named in a small chip. */
export type AttachmentKind =
  | "voice"
  | "photo"
  | "view_once"
  | "gif"
  | "sticker"
  | "money_sent"
  | "money_request"
  | "link"
  | "moment"

export interface AttachmentChip {
  kind: AttachmentKind
  label: string
}

/** The media of a message worth showing beside its words when it is answered or edited. */
export type GlimpseMedia =
  | { kind: "voice"; note: VoiceNote }
  | { kind: "photos"; urls: string[]; extra: number }
  | { kind: "gif"; url: string }
  | { kind: "sticker"; sticker: StickerAttachment }

/** A whole message, shown small: what the composer says you are answering or editing. */
export interface MessageGlimpse {
  text: string | null
  removed: boolean
  media: GlimpseMedia | null
  chips: AttachmentChip[]
  moment: QuotedMoment | null
}

/** A quoted message inside a bubble. The server only says what it carried, not the thing itself. */
export interface ReplyGlimpse {
  text: string | null
  removed: boolean
  chips: AttachmentChip[]
}

export interface ComposerContext {
  kind: "edit" | "reply"
  label: string
  glimpse: MessageGlimpse
  /** The name of the button that drops it. */
  hint: string
}

/** One of the things the composer's plus button offers. */
export interface ComposerAction {
  key: string
  icon: LucideIcon
  label: string
  hint: string
  onPress: () => void
}

export interface VoiceControls {
  recording: boolean
  durationMs: number
  levels: number[]
  slide: number
  onStart: () => void
  onSlide: (translationX: number) => void
  onFinish: (cancelled: boolean) => void
}
