import type { WornTheme } from "@/features/chat-themes/types"
import {
  conversationChanged,
  markConversationSeen,
  markPhotoOpened,
  patchConversation,
  prependMessage,
  replaceMessage,
  setPeerRead,
  unreadChanged,
} from "./cache"
import type { Message } from "./types"

export function onMessageNew(payload: {
  conversation_id: string
  message: Message
}): void {
  prependMessage(payload.conversation_id, payload.message)
  unreadChanged()
}

export function onMessageUpdated(payload: {
  conversation_id: string
  message: Message
}): void {
  replaceMessage(payload.conversation_id, payload.message)
}

export function onConversationRevealed(payload: {
  conversation_id: string
}): void {
  conversationChanged(payload.conversation_id)
}

export function onConversationTheme(payload: {
  conversation_id: string
  theme: WornTheme | null
}): void {
  patchConversation(payload.conversation_id, (conversation) => ({
    ...conversation,
    theme: payload.theme,
  }))
}

export function onConversationRead(payload: {
  conversation_id: string
  read_at: string
}): void {
  setPeerRead(payload.conversation_id, payload.read_at)
}

export function onConversationSeen(payload: {
  conversation_id: string
  read_at: string
}): void {
  markConversationSeen(payload.conversation_id)
  unreadChanged()
}

export function onPhotoOpened(payload: {
  conversation_id: string
  message_id: string
  media_id: string
}): void {
  markPhotoOpened(payload.conversation_id, payload.media_id)
}
