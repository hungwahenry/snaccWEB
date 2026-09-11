"use client"

import { useQuery } from "@tanstack/react-query"
import { getChatRooms } from "../api"
import { chatKeys } from "../utils/keys"
import { useRoomsEnabled } from "./use-rooms-enabled"

export function useChatRooms() {
  const enabled = useRoomsEnabled()

  return useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: getChatRooms,
    staleTime: 30_000,
    enabled,
  })
}
