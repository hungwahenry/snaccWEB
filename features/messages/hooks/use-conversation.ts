"use client"

import { useQuery } from "@tanstack/react-query"
import { getConversation } from "../api"
import { conversationKey } from "../utils/keys"

export function useConversation(id: string) {
  return useQuery({
    queryKey: conversationKey(id),
    queryFn: () => getConversation(id),
    enabled: id.length > 0,
  })
}
