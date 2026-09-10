"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listChatMessages } from "../api"
import { chatMessagesKey } from "../keys"

export function useChatMessages(roomId: string) {
  const { items, ...list } = useInfiniteList(
    chatMessagesKey(roomId),
    (page) => listChatMessages(roomId, page),
    { enabled: roomId.length > 0 }
  )
  return { messages: items, ...list }
}
