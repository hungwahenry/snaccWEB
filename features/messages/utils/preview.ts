import {
  findShareLinks,
  withoutShareLinks,
  type ShareKind,
} from "@/lib/share-links"
import { formatNaira } from "@/lib/format"
import type { Conversation, Message, ReplyPreview } from "../types"

const SHARE_LABEL: Record<ShareKind, string> = {
  snacc: "🔗 Shared a snacc",
  profile: "🔗 Shared a profile",
  campus: "🔗 Shared a campus",
  pay: "🔗 Shared a pay link",
}

export function previewOf(body: string | null, imageCount: number): string {
  if (body) {
    const links = findShareLinks(body)
    if (links.length === 0) return body
    return withoutShareLinks(body) || SHARE_LABEL[links[0].kind]
  }
  if (imageCount > 1) return `📷 ${imageCount} photos`
  if (imageCount === 1) return "📷 Photo"
  return ""
}

export function messagePreview(message: Message): string {
  if (!message.body && message.voice) return "🎤 Voice note"
  if (!message.body && message.sticker) return "✨ Sticker"
  if (!message.body && message.gif) return "🎞️ GIF"
  if (message.money?.kind === "request")
    return `🙏 Asked for ${formatNaira(message.money.amount)}`
  if (!message.body && message.money)
    return `💸 ${formatNaira(message.money.amount)}`
  return previewOf(message.body, message.images.length)
}

export function replyPreview(reply: ReplyPreview): string {
  if (reply.removed) return "Removed message"
  if (reply.money?.kind === "request")
    return `🙏 Asked for ${formatNaira(reply.money.amount)}`
  if (!reply.body && reply.money) return `💸 ${formatNaira(reply.money.amount)}`
  if (!reply.body && reply.has_voice) return "🎤 Voice note"
  if (!reply.body && reply.has_sticker) return "✨ Sticker"
  if (!reply.body && reply.has_gif) return "🎞️ GIF"
  return previewOf(reply.body, reply.has_images ? 1 : 0)
}

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
    money: message.money ?? null,
  }
}

export function conversationPreview(conversation: Conversation): string {
  const last = conversation.last_message
  if (!last) return "No messages yet"
  if (last.removed) return "Message removed"
  return last.mine ? `You: ${messagePreview(last)}` : messagePreview(last)
}

export function removedLabel(message: Message): string {
  if (!message.deleted_by_sender) return "This message was removed"
  return message.mine ? "You deleted this message" : "This message was deleted"
}

export function partyName(conversation: Conversation): string {
  return (
    conversation.other.display_name ?? conversation.other.username ?? "Ghost"
  )
}
