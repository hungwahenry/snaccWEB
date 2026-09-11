import {
  conversationChanged,
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

export function onConversationRead(payload: {
  conversation_id: string
  read_at: string
}): void {
  setPeerRead(payload.conversation_id, payload.read_at)
}
