"use client"

import { useQuery } from "@tanstack/react-query"
import { getChatRoom } from "../api"
import { findRoom } from "../cache"
import { chatKeys } from "../utils/keys"

export function useChatRoom(roomId: string) {
  return useQuery({
    queryKey: chatKeys.room(roomId),
    queryFn: () => getChatRoom(roomId),
    placeholderData: () => findRoom(roomId),
    staleTime: 30_000,
  })
}
