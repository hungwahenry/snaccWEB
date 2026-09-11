import { withoutShareLinks } from "@/lib/share-links"
import type { ChatMessage } from "../types"
import { chatReplyGlimpse, removedLabel, replyAuthor } from "./rooms"

/** What a room bubble draws, worked out once so the bubble only lays it out. */
export function chatBubbleParts(message: ChatMessage) {
  const deleted = message.deleted
  const voice = deleted ? null : message.voice
  const hasText = message.body !== null || message.edited || deleted
  const reply = message.reply_to

  return {
    // The link itself moves to the card below; the words around it stay.
    body: message.body ? withoutShareLinks(message.body) || null : null,
    removedText: deleted ? removedLabel(message) : null,
    images: deleted ? [] : message.images,
    sticker: deleted ? null : message.sticker,
    gif: deleted ? null : message.gif,
    voice,
    reply: reply ? chatReplyGlimpse(reply) : null,
    replyAuthor: reply ? replyAuthor(reply) : null,
    hasText,
    bubbled: hasText || voice !== null || reply !== null,
  }
}
