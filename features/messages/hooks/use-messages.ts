"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listMessages } from "../api"
import { messageKeys } from "../utils/keys"

export function useMessages(conversationId: string) {
  const { items, ...list } = useInfiniteList(
    messageKeys.thread(conversationId),
    (page) => listMessages(conversationId, page),
    { enabled: conversationId.length > 0 }
  )
  return { messages: items, ...list }
}
