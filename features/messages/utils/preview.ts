import { countLabel, formatNaira } from "@/lib/format"
import { nameOf } from "@/features/users/utils/names"
import type { Conversation, Message, ReplyPreview } from "../types"
import { SHARE_LABEL, splitShareLinks } from "./share"

/** What someone in a conversation is called; an anonymous one is a Ghost. */
export function partyName(conversation: Conversation): string {
  return nameOf(conversation.other, "Ghost")
}

function bodyPreview(body: string): string {
  const { words, link } = splitShareLinks(body)
  return words ?? (link ? `🔗 ${SHARE_LABEL[link]}` : "")
}

/** One line of text for a message, as a list row shows it. */
export function messagePreview(message: Message): string {
  if (message.money?.kind === "request")
    return `🙏 Asked for ${formatNaira(message.money.amount)}`
  if (message.body) return bodyPreview(message.body)
  if (message.money) return `💸 ${formatNaira(message.money.amount)}`
  if (message.voice) return "🎤 Voice note"
  if (message.sticker) return "✨ Sticker"
  if (message.gif) return "🎞️ GIF"
  if (message.images.length > 1)
    return `📷 ${countLabel(message.images.length, "photo")}`
  if (message.images.length === 1) return "📷 Photo"
  return ""
}

export function conversationPreview(conversation: Conversation): string {
  const last = conversation.last_message
  if (!last) return "No messages yet"
  if (last.removed) return "Message removed"
  return last.mine ? `You: ${messagePreview(last)}` : messagePreview(last)
}

export function hitTitle(conversation: Conversation, mine: boolean): string {
  const who = partyName(conversation)
  return mine ? `You → ${who}` : who
}

export function removedLabel(message: Message): string {
  if (!message.deleted_by_sender) return "This message was removed"
  return message.mine ? "You deleted this message" : "This message was deleted"
}

/** What a quoted message keeps of the original: enough to say what it was, not to show it. */
export function toReplyPreview(message: Message): ReplyPreview {
  return {
    id: message.id,
    body: message.body,
    removed: message.removed,
    mine: message.mine,
    has_images: message.images.length > 0,
    has_sticker: message.sticker !== null,
    has_gif: message.gif !== null,
    has_voice: message.voice !== null,
    money: message.money
      ? { kind: message.money.kind, amount: message.money.amount }
      : null,
  }
}
