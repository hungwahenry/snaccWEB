"use client"

import { useQuery } from "@tanstack/react-query"
import { getConversation } from "../api"
import { findConversation } from "../cache"
import { messageKeys } from "../utils/keys"

export function useConversation(id: string) {
  return useQuery({
    queryKey: messageKeys.conversation(id),
    queryFn: () => getConversation(id),
    enabled: id.length > 0,
    placeholderData: () => findConversation(id),
  })
}
