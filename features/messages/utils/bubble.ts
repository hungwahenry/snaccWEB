import { withoutShareLinks } from "@/lib/share-links"
import type { Message, ReplyGlimpse } from "../types"
import { replyGlimpse } from "./glimpse"
import { shownImagesOf, viewOnceOf } from "./images"
import { removedLabel } from "./preview"

/** What a message bubble draws, worked out once so the bubble only lays it out. */
export function bubbleParts(message: Message) {
  const removed = message.removed
  const voice = removed ? null : message.voice
  const money = removed ? null : message.money
  const viewOnce = viewOnceOf(message) ?? null
  const hasText =
    (message.body !== null && !message.money) || message.edited || removed
  const reply: ReplyGlimpse | null = message.reply_to
    ? replyGlimpse(message.reply_to, "Removed message")
    : null

  return {
    // The link itself moves to the card below; the words around it stay.
    body: message.body ? withoutShareLinks(message.body) || null : null,
    removedText: removed ? removedLabel(message) : null,
    note: removed ? null : message.body,
    images: shownImagesOf(message),
    sticker: removed ? null : message.sticker,
    gif: removed ? null : message.gif,
    viewOnce,
    voice,
    money,
    reply,
    moment: message.moment,
    hasText,
    bubbled:
      hasText ||
      voice !== null ||
      reply !== null ||
      message.moment !== null ||
      money !== null ||
      viewOnce !== null,
  }
}

export type BubbleParts = ReturnType<typeof bubbleParts>
