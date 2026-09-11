"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listConversations } from "../api"
import { messageKeys } from "../utils/keys"

export function useConversations(q = "") {
  const enabled = useFlag("anon_messages")
  const { items, ...list } = useInfiniteList(
    messageKeys.conversations(q),
    (page) => listConversations(page, q),
    { enabled }
  )
  return { conversations: items, ...list }
}
