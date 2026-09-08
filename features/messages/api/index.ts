import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import { appendImage, type PickedImage } from "@/lib/media"
import type {
  Conversation,
  Message,
  MessageHit,
  MessageSettings,
  OpenedPhoto,
} from "../types"

export function listConversations(
  page: number,
  q?: string
): Promise<Paginated<Conversation>> {
  return api.get<Paginated<Conversation>>("/conversations", {
    page,
    q: q || undefined,
  })
}

export function getConversation(id: string): Promise<Conversation> {
  return api.get<Conversation>(`/conversations/${id}`)
}

export function listMessages(
  conversationId: string,
  page: number
): Promise<Paginated<Message>> {
  return api.get<Paginated<Message>>(
    `/conversations/${conversationId}/messages`,
    { page }
  )
}

export interface SendMessageInput {
  id: string
  body?: string
  replyToId?: string
  images?: PickedImage[]
  viewOnce?: boolean
  giphyId?: string
}

export function sendMessage(
  conversationId: string,
  input: SendMessageInput
): Promise<Message> {
  const path = `/conversations/${conversationId}/messages`

  if (!input.images?.length) {
    return api.post<Message>(path, {
      id: input.id,
      body: input.body,
      replyToId: input.replyToId,
      giphyId: input.giphyId,
    })
  }

  const form = new FormData()
  const fields: [string, string | undefined][] = [
    ["id", input.id],
    ["body", input.body],
    ["replyToId", input.replyToId],
    ["viewOnce", input.viewOnce ? "true" : undefined],
  ]
  fields.forEach(([name, value]) => {
    if (value) form.append(name, value)
  })
  input.images.forEach((image, index) =>
    appendImage(form, "images", image, `message-${index}`)
  )

  return api.upload<Message>(path, form)
}

export function editMessage(
  conversationId: string,
  messageId: string,
  body: string
): Promise<Message> {
  return api.patch<Message>(
    `/conversations/${conversationId}/messages/${messageId}`,
    { body }
  )
}

export function deleteMessage(
  conversationId: string,
  messageId: string
): Promise<Message> {
  return api.del<Message>(
    `/conversations/${conversationId}/messages/${messageId}`
  )
}

export function reactToMessage(
  conversationId: string,
  messageId: string,
  emoji: string
): Promise<Message> {
  return api.put<Message>(
    `/conversations/${conversationId}/messages/${messageId}/reaction`,
    { emoji }
  )
}

export function unreactToMessage(
  conversationId: string,
  messageId: string
): Promise<Message> {
  return api.del<Message>(
    `/conversations/${conversationId}/messages/${messageId}/reaction`
  )
}

export async function markConversationRead(id: string): Promise<void> {
  await api.post(`/conversations/${id}/read`)
}

export async function sendTyping(id: string): Promise<void> {
  await api.post(`/conversations/${id}/typing`)
}

export function revealSelf(id: string): Promise<Conversation> {
  return api.post<Conversation>(`/conversations/${id}/reveal`)
}

export async function blockGhost(id: string): Promise<void> {
  await api.post(`/conversations/${id}/block`)
}

export async function unblockGhost(id: string): Promise<void> {
  await api.post(`/conversations/${id}/unblock`)
}

export async function findConversationWith(
  userId: string
): Promise<string | null> {
  const result = await api.get<{ conversation_id: string | null }>(
    `/conversations/with/${userId}`
  )
  return result.conversation_id
}

export function startConversation(
  targetId: string,
  body: string
): Promise<Conversation> {
  return api.post<Conversation>("/conversations", { targetId, body })
}

export function searchMessages(
  q: string,
  page: number
): Promise<Paginated<MessageHit>> {
  return api.get<Paginated<MessageHit>>("/conversations/messages/search", {
    q,
    page,
  })
}

export async function fetchUnreadMessages(): Promise<number> {
  const result = await api.get<{ count: number }>("/conversations/unread-count")
  return result.count
}

export async function updateMessageSettings(
  settings: MessageSettings
): Promise<void> {
  await api.put("/conversations/settings", settings)
}

const photoPath = (
  conversationId: string,
  messageId: string,
  photoId: string
) => `/conversations/${conversationId}/messages/${messageId}/photos/${photoId}`

export function openPhoto(
  conversationId: string,
  messageId: string,
  photoId: string
): Promise<OpenedPhoto> {
  return api.post<OpenedPhoto>(
    `${photoPath(conversationId, messageId, photoId)}/open`
  )
}

export async function reportScreenshot(
  conversationId: string,
  messageId: string,
  photoId: string
): Promise<void> {
  await api.post(`${photoPath(conversationId, messageId, photoId)}/screenshot`)
}
