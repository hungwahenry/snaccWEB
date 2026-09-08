import { getQueryClient } from "@/lib/query-client"
import { prependMessage, replaceMessage } from "./cache"
import type { Conversation, Message } from "./types"
import {
  CONVERSATIONS_KEY,
  conversationKey,
  UNREAD_MESSAGES_KEY,
} from "./utils/keys"

export function onMessageNew(payload: {
  conversation_id: string
  message: Message
}): void {
  prependMessage(payload.conversation_id, payload.message)
  void getQueryClient().invalidateQueries({ queryKey: UNREAD_MESSAGES_KEY })
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
  const queryClient = getQueryClient()
  void queryClient.invalidateQueries({
    queryKey: conversationKey(payload.conversation_id),
  })
  void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY })
}

export function onConversationRead(payload: {
  conversation_id: string
  read_at: string
}): void {
  getQueryClient().setQueryData<Conversation>(
    conversationKey(payload.conversation_id),
    (c) => (c ? { ...c, peer_read_at: payload.read_at } : c)
  )
}
