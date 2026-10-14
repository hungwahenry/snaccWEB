import type { RoomListQuery, RoomMessageQuery } from "../types"

export const adminRoomKeys = {
  all: () => ["admin", "rooms"] as const,
  list: (query: RoomListQuery) => ["admin", "rooms", "list", query] as const,
  detail: (id: string) => ["admin", "rooms", "detail", id] as const,
  messages: (id: string, query: RoomMessageQuery) =>
    ["admin", "rooms", "messages", id, query] as const,
}
