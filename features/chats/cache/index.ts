import { authKeys } from "@/features/auth/utils/keys"
import type { User } from "@/features/users/types"
import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import { filterItems, findItem, mapItems, prependItem } from "@/lib/query/pages"
import type { ChatMessage, ChatRoom, RoomMessagePayload } from "../types"
import { chatKeys } from "../utils/keys"
import { claimPayload } from "../utils/payload"

type Pages = PaginatedPages<ChatMessage>

const client = () => getQueryClient()

function changeRoom(
  roomId: string,
  change: (data: Pages | undefined) => Pages | undefined
): void {
  client().setQueryData<Pages>(chatKeys.messages(roomId), change)
}

export function findChatMessage(
  roomId: string,
  id: string
): ChatMessage | undefined {
  return findItem(
    client().getQueryData<Pages>(chatKeys.messages(roomId)),
    (message) => message.id === id
  )
}

/** Puts a message at the bottom of the room, or updates it in place if it is already there. */
export function upsertChatMessage(roomId: string, message: ChatMessage): void {
  changeRoom(roomId, (data) =>
    findItem(data, (m) => m.id === message.id)
      ? mapItems(data, (m) => (m.id === message.id ? message : m))
      : prependItem(data, message)
  )
}

export function patchChatMessage(
  roomId: string,
  id: string,
  patch: (message: ChatMessage) => ChatMessage
): void {
  changeRoom(roomId, (data) =>
    mapItems(data, (m) => (m.id === id ? patch(m) : m))
  )
}

export function removeChatMessage(roomId: string, id: string): void {
  changeRoom(roomId, (data) => filterItems(data, (m) => m.id !== id))
}

/** Swaps your stand-in for the server's copy, or drops it if the copy already came in live. */
export function settleChatMessage(
  roomId: string,
  sentId: string,
  real: ChatMessage
): void {
  if (sentId !== real.id && findChatMessage(roomId, real.id)) {
    removeChatMessage(roomId, sentId)
    return
  }
  changeRoom(roomId, (data) =>
    mapItems(data, (m) => (m.id === sentId ? real : m))
  )
}

/** A room broadcast, settled against who you are and the copy already on screen. */
export function claimBroadcast(
  roomId: string,
  payload: RoomMessagePayload
): ChatMessage {
  const me = client().getQueryData<User>(authKeys.me())
  return claimPayload(payload, me?.id, findChatMessage(roomId, payload.id))
}

function patchRoom(
  roomId: string,
  patch: (room: ChatRoom) => ChatRoom
): ChatRoom[] | undefined {
  const previous = client().getQueryData<ChatRoom[]>(chatKeys.rooms())
  client().setQueryData<ChatRoom[]>(chatKeys.rooms(), (rooms) =>
    rooms?.map((room) => (room.id === roomId ? patch(room) : room))
  )
  return previous
}

/** A new message, counted where the list already is: refetching here would send every reader in a
 * busy room back to the server for every message. */
export function bumpRoom(roomId: string, at: string): void {
  patchRoom(roomId, (room) => ({
    ...room,
    unread: room.unread + 1,
    last_message_at: at,
  }))
}

export function markRoomSeen(roomId: string): void {
  patchRoom(roomId, (room) => ({ ...room, unread: 0 }))
}

export function setRoomMuted(
  roomId: string,
  muted: boolean
): ChatRoom[] | undefined {
  return patchRoom(roomId, (room) => ({ ...room, muted }))
}

export function setRoomLocked(roomId: string, locked: boolean): void {
  patchRoom(roomId, (room) => ({ ...room, locked }))
}

export function restoreRooms(rooms: ChatRoom[] | undefined): void {
  if (rooms) client().setQueryData(chatKeys.rooms(), rooms)
}

export function roomsChanged(): void {
  void client().invalidateQueries({ queryKey: chatKeys.rooms() })
}
