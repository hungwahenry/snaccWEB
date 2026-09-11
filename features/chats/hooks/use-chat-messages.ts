"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listChatMessages } from "../api"
import { chatKeys } from "../utils/keys"

export function useChatMessages(roomId: string) {
  const { items, ...list } = useInfiniteList(
    chatKeys.messages(roomId),
    (page) => listChatMessages(roomId, page),
    { enabled: roomId.length > 0 }
  )
  return { messages: items, ...list }
}
