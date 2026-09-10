import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { ChatMessage, ChatRoom } from "../types"

export const listChatRooms = () => api.get<ChatRoom[]>("/chats/rooms")

export const listChatMessages = (roomId: string, page: number) =>
  api.get<Paginated<ChatMessage>>(`/chats/rooms/${roomId}/messages`, { page })

export const sendChatMessage = (input: {
  id: string
  roomId: string
  body?: string
  replyToId?: string
}) =>
  api.post<ChatMessage>(`/chats/rooms/${input.roomId}/messages`, {
    id: input.id,
    body: input.body,
    replyToId: input.replyToId,
  })

export const markChatRoomRead = (roomId: string) =>
  api.put(`/chats/rooms/${roomId}/read`)

export const setChatRoomMuted = (roomId: string, muted: boolean) =>
  muted ? api.put(`/chats/rooms/${roomId}/mute`) : api.del(`/chats/rooms/${roomId}/mute`)

export const deleteChatMessage = (id: string) => api.del(`/chats/messages/${id}`)
