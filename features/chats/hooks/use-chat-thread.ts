"use client"

import { useEffect, useMemo } from "react"
import { decorateThread } from "@/features/messages/utils/thread"
import { markChatRoomRead } from "../api"
import { markRoomSeen, roomsChanged } from "../cache"
import { sameSender } from "../utils/rooms"
import { useChatMessages } from "./use-chat-messages"

function markRead(roomId: string) {
  markRoomSeen(roomId)
  void markChatRoomRead(roomId)
    .then(roomsChanged)
    .catch(() => undefined)
}

/** The room's messages as a thread, read on the way in and again on the way out. */
export function useChatThread(roomId: string) {
  const messages = useChatMessages(roomId)

  const items = useMemo(
    () =>
      decorateThread(messages.messages, messages.hasMore ?? false, {
        sameSide: sameSender,
      }),
    [messages.messages, messages.hasMore]
  )

  // Whatever arrived while the room was open is not unread. Nothing in between, so the room push
  // stays one per visit.
  useEffect(() => {
    if (!roomId) return
    markRead(roomId)
    return () => markRead(roomId)
  }, [roomId])

  return { messages, items }
}
