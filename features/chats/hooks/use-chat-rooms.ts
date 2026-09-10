"use client"

import { useQuery } from "@tanstack/react-query"
import { listChatRooms } from "../api"
import { CHAT_ROOMS_KEY } from "../keys"

export function useChatRooms() {
  return useQuery({
    queryKey: CHAT_ROOMS_KEY,
    queryFn: listChatRooms,
    staleTime: 30_000,
  })
}
