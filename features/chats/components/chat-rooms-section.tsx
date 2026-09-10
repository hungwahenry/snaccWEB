"use client"

import { useChatRooms } from "../hooks/use-chat-rooms"
import { ChatRoomRow } from "./chat-room-row"

/// Rooms sit above conversations rather than in their own tab: a place you are already in and a
/// thread you already have are the same act.
export function ChatRoomsSection() {
  const rooms = useChatRooms()
  if (!rooms.data?.length) return null

  return (
    <section className="border-b border-border pb-2">
      <h2 className="px-4 pt-2 pb-1 text-xs font-bold uppercase text-muted-foreground">
        Rooms
      </h2>
      {rooms.data.map((room) => (
        <ChatRoomRow key={room.id} room={room} />
      ))}
    </section>
  )
}
