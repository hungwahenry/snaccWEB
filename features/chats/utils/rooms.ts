import { messageGlimpse, replyGlimpse } from "@/features/messages/utils/glimpse"
import type {
  ComposerContext,
  MessageGlimpse,
  ReplyGlimpse,
} from "@/features/messages/types"
import { handleOf } from "@/features/users/utils/names"
import { editWindowClosesAt } from "@/lib/format"
import type { ChatMessage, ChatReplyPreview, ChatRoom } from "../types"

export function roomTitle(room: ChatRoom | null): string {
  if (!room) return "Room"
  return room.campus ? room.campus.acronym : "Everyone"
}

export function roomSubtitle(room: ChatRoom | null): string {
  return room?.campus ? room.campus.name : "Everyone on Snacc"
}

/** Rooms with something new, the way the DM count is conversations rather than messages. */
export function unreadRoomCount(rooms: ChatRoom[] | undefined): number {
  return rooms?.filter((room) => room.unread > 0 && !room.muted).length ?? 0
}

/** A room can have a lot of people typing at once, so past two it becomes a count. */
export function typingLabel(names: string[]): string | null {
  if (names.length === 0) return null
  if (names.length === 1) return `${names[0]} is typing…`
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing…`
  return `${names[0]} and ${names.length - 1} others are typing…`
}

export function removedLabel(
  message: Pick<ChatMessage, "deleted_by_sender">
): string {
  return message.deleted_by_sender
    ? "Message withdrawn"
    : "Removed by a moderator"
}

export function canActOn(message: ChatMessage): boolean {
  return message.status === undefined && !message.deleted
}

export function canEditChatMessage(
  message: ChatMessage,
  windowMinutes: number,
  now = Date.now()
): boolean {
  if (!message.mine || !canActOn(message) || windowMinutes <= 0) return false
  return now < editWindowClosesAt(message.created_at, windowMinutes)
}

/** The message as it looks once your reaction is `emoji`, or none when null: your old one counts
 * one fewer, the new one one more. */
export function withMyChatReaction(
  message: ChatMessage,
  emoji: string | null
): ChatMessage {
  const reactions = message.reactions
    .map((reaction) =>
      reaction.mine
        ? { ...reaction, count: reaction.count - 1, mine: false }
        : reaction
    )
    .filter((reaction) => reaction.count > 0)

  if (emoji === null) return { ...message, reactions }

  const existing = reactions.find((reaction) => reaction.emoji === emoji)
  return {
    ...message,
    reactions: existing
      ? reactions.map((reaction) =>
          reaction === existing
            ? { ...reaction, count: reaction.count + 1, mine: true }
            : reaction
        )
      : [...reactions, { emoji, count: 1, mine: true }],
  }
}

/** The photo a sticker can be cut from: the first one, if any. */
export function chatStickerSource(
  message: ChatMessage
): { url: string; width: number; height: number } | null {
  const [image] = message.images
  return image
    ? { url: image.url, width: image.width, height: image.height }
    : null
}

/** A room's runs follow the speaker, where a DM's follow the side. */
export const sameSender = (a: ChatMessage, b: ChatMessage) =>
  a.sender.id === b.sender.id

/** Your message once withdrawn: the gap everyone else sees. */
export function withdrawn(message: ChatMessage): ChatMessage {
  return {
    ...message,
    deleted: true,
    deleted_by_sender: true,
    body: null,
    images: [],
    voice: null,
    sticker: null,
    gif: null,
    reactions: [],
  }
}

export function toReplyPreview(message: ChatMessage): ChatReplyPreview {
  return {
    id: message.id,
    body: message.body,
    sender_username: message.sender.username,
    deleted: message.deleted,
    has_images: message.images.length > 0,
    has_sticker: message.sticker !== null,
    has_gif: message.gif !== null,
    has_voice: message.voice !== null,
  }
}

export function chatGlimpse(message: ChatMessage): MessageGlimpse {
  return messageGlimpse(
    {
      body: message.body,
      removed: message.deleted,
      mine: message.mine,
      images: message.images,
      voice: message.voice,
      gif: message.gif,
      sticker: message.sticker,
      money: null,
      moment: null,
    },
    removedLabel(message)
  )
}

export function chatReplyGlimpse(reply: ChatReplyPreview): ReplyGlimpse {
  return replyGlimpse(
    {
      body: reply.body,
      removed: reply.deleted,
      mine: false,
      has_images: reply.has_images,
      has_sticker: reply.has_sticker,
      has_gif: reply.has_gif,
      has_voice: reply.has_voice,
      money: null,
    },
    "Removed message"
  )
}

/** A quote in a room names who said it, since a room is many people. */
export function replyAuthor(reply: ChatReplyPreview): string {
  return reply.sender_username ? `@${reply.sender_username}` : "Someone"
}

export function chatComposerContext(input: {
  editing: ChatMessage | null
  replyingTo: ChatMessage | null
}): ComposerContext | null {
  if (input.editing) {
    return {
      kind: "edit",
      label: "Editing your message",
      glimpse: chatGlimpse(input.editing),
      hint: "Cancel edit",
    }
  }

  const reply = input.replyingTo
  if (!reply) return null

  return {
    kind: "reply",
    label: reply.mine
      ? "Replying to yourself"
      : `Replying to ${handleOf(reply.sender) ?? "them"}`,
    glimpse: chatGlimpse(reply),
    hint: "Cancel reply",
  }
}
