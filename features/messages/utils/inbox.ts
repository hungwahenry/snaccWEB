import type { ChatRoom } from "@/features/chats/types"
import type { Conversation } from "../types"

export type InboxEntry =
  | { kind: "dm"; key: string; conversation: Conversation }
  | { kind: "room"; key: string; room: ChatRoom }

const roomEntry = (room: ChatRoom): InboxEntry => ({
  kind: "room",
  key: `room:${room.id}`,
  room,
})

function activityOf(room: ChatRoom): number {
  const at = room.active_at ?? room.last_message_at
  return at ? Date.parse(at) : 0
}

export function pinnedRooms(rooms: ChatRoom[]): ChatRoom[] {
  return rooms.filter((room) => room.kind !== "hangout")
}

export function inboxEntries(
  conversations: Conversation[],
  rooms: ChatRoom[],
  complete: boolean
): InboxEntry[] {
  const hangouts = rooms
    .filter((room) => room.kind === "hangout")
    .sort((a, b) => activityOf(b) - activityOf(a))
  const entries: InboxEntry[] = []
  let next = 0

  for (const conversation of conversations) {
    const at = Date.parse(conversation.last_message_at)
    while (next < hangouts.length && activityOf(hangouts[next]) >= at) {
      entries.push(roomEntry(hangouts[next]))
      next += 1
    }
    entries.push({ kind: "dm", key: `dm:${conversation.id}`, conversation })
  }

  if (complete) entries.push(...hangouts.slice(next).map(roomEntry))

  return entries
}
