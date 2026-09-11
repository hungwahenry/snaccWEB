"use client"

import { unreadRoomCount } from "../utils/rooms"
import { useChatRooms } from "./use-chat-rooms"

export function useUnreadRooms(): number {
  return unreadRoomCount(useChatRooms().data)
}
