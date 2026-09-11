import { messageUploadForm } from "@/features/messages/api"
import type { VoiceDraft } from "@/features/voice/types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { PickedImage } from "@/lib/media"
import type {
  ChatMessage,
  ChatMessagePayload,
  ChatReactor,
  ChatRoom,
} from "../types"
import { fromPayload } from "../utils/payload"

const id = encodeURIComponent
const roomPath = (roomId: string) => `/chats/rooms/${id(roomId)}`
const messagePath = (messageId: string) => `/chats/messages/${id(messageId)}`

export function getChatRooms(): Promise<ChatRoom[]> {
  return api.get<ChatRoom[]>("/chats/rooms")
}

export async function listChatMessages(
  roomId: string,
  page: number
): Promise<Paginated<ChatMessage>> {
  const found = await api.get<Paginated<ChatMessagePayload>>(
    `${roomPath(roomId)}/messages`,
    { page }
  )
  return { ...found, items: found.items.map(fromPayload) }
}

export interface SendChatMessageInput {
  id: string
  body?: string
  replyToId?: string
  images?: PickedImage[]
  voice?: VoiceDraft
  stickerId?: string
  giphyId?: string
}

export async function sendChatMessage(
  roomId: string,
  input: SendChatMessageInput
): Promise<ChatMessage> {
  const path = `${roomPath(roomId)}/messages`

  if (!input.images?.length && !input.voice) {
    return fromPayload(
      await api.post<ChatMessagePayload>(path, {
        id: input.id,
        body: input.body,
        replyToId: input.replyToId,
        stickerId: input.stickerId,
        giphyId: input.giphyId,
      })
    )
  }

  return fromPayload(
    await api.upload<ChatMessagePayload>(path, messageUploadForm(input, "chat"))
  )
}

export async function editChatMessage(
  messageId: string,
  body: string
): Promise<ChatMessage> {
  return fromPayload(
    await api.patch<ChatMessagePayload>(messagePath(messageId), { body })
  )
}

export async function reactToChatMessage(
  messageId: string,
  emoji: string
): Promise<ChatMessage> {
  return fromPayload(
    await api.put<ChatMessagePayload>(`${messagePath(messageId)}/reaction`, {
      emoji,
    })
  )
}

export async function unreactToChatMessage(
  messageId: string
): Promise<ChatMessage> {
  return fromPayload(
    await api.del<ChatMessagePayload>(`${messagePath(messageId)}/reaction`)
  )
}

export function listChatReactors(
  messageId: string,
  emoji: string | undefined,
  page: number
): Promise<Paginated<ChatReactor>> {
  return api.get<Paginated<ChatReactor>>(
    `${messagePath(messageId)}/reactions`,
    { emoji, page }
  )
}

export async function markChatRoomRead(roomId: string): Promise<void> {
  await api.put(`${roomPath(roomId)}/read`)
}

export async function muteChatRoom(roomId: string): Promise<void> {
  await api.put(`${roomPath(roomId)}/mute`)
}

export async function unmuteChatRoom(roomId: string): Promise<void> {
  await api.del(`${roomPath(roomId)}/mute`)
}

export async function deleteChatMessage(messageId: string): Promise<void> {
  await api.del(messagePath(messageId))
}
