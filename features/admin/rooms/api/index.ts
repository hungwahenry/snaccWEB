import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminRoom,
  AdminRoomMessage,
  RoomListQuery,
  RoomMessageQuery,
} from "../types"

export function listRooms(query: RoomListQuery) {
  return api.get<Paginated<AdminRoom>>("/admin/chats/rooms", query)
}

export function getRoom(id: string) {
  return api.get<AdminRoom>(`/admin/chats/rooms/${id}`)
}

export function listRoomMessages(id: string, query: RoomMessageQuery) {
  return api.get<Paginated<AdminRoomMessage>>(
    `/admin/chats/rooms/${id}/messages`,
    query
  )
}

export function lockRoom(id: string) {
  return api.put<null>(`/admin/chats/rooms/${id}/lock`)
}

export function unlockRoom(id: string) {
  return api.del<null>(`/admin/chats/rooms/${id}/lock`)
}

export function removeRoomMessage(id: string, reason?: string) {
  return api.del<null>(`/admin/chats/messages/${id}`, { reason })
}

export function releaseRoomMessage(id: string) {
  return api.post<null>(`/admin/chats/messages/${id}/release`, {})
}
