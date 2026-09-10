import { getQueryClient } from "@/lib/query-client"
import { replaceChatMessage, upsertChatMessage } from "./cache"
import { CHAT_ROOMS_KEY } from "./keys"
import type { ChatMessage } from "./types"

export function onChatMessage(payload: {
  room_id: string
  message: ChatMessage
}): void {
  upsertChatMessage(payload.room_id, payload.message)
  void getQueryClient().invalidateQueries({ queryKey: CHAT_ROOMS_KEY })
}

export function onChatMessageRemoved(payload: {
  room_id: string
  message: ChatMessage
}): void {
  replaceChatMessage(payload.room_id, payload.message)
}
