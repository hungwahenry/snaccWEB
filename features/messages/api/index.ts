import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { VoiceDraft } from "@/features/voice/types"
import { voiceFileName } from "@/features/voice/utils/recording"
import { appendImage, type PickedImage } from "@/lib/media"
import type { WornTheme } from "@/features/chat-themes/types"

const ALL_CHATS_THEME_PATH = "/chat-themes/all-chats"
import type {
  Conversation,
  ConversationPhoto,
  Message,
  MessageHit,
  MessageSettings,
  OpenedPhoto,
} from "../types"

const conversationPath = (id: string) =>
  `/conversations/${encodeURIComponent(id)}`

const messagePath = (conversationId: string, messageId: string) =>
  `${conversationPath(conversationId)}/messages/${encodeURIComponent(messageId)}`

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
  return api.get<Conversation>(conversationPath(id))
}

export function listMessages(
  conversationId: string,
  page: number
): Promise<Paginated<Message>> {
  return api.get<Paginated<Message>>(
    `${conversationPath(conversationId)}/messages`,
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
  stickerId?: string
  giphyStickerId?: string
  voice?: VoiceDraft
}

/** The multipart body for a message carrying photos or a voice note, in a DM or a room. */
export function messageUploadForm(
  input: Omit<SendMessageInput, "giphyId">,
  prefix: string
): FormData {
  const form = new FormData()
  const fields: [string, string | undefined][] = [
    ["id", input.id],
    ["body", input.body],
    ["replyToId", input.replyToId],
    ["viewOnce", input.viewOnce ? "true" : undefined],
    ["stickerId", input.stickerId],
    ["giphyStickerId", input.giphyStickerId],
    [
      "voiceDurationMs",
      input.voice ? String(Math.round(input.voice.durationMs)) : undefined,
    ],
  ]
  fields.forEach(([name, value]) => {
    if (value) form.append(name, value)
  })
  input.images?.forEach((image, index) =>
    appendImage(form, "images", image, `${prefix}-${index}`)
  )
  if (input.voice)
    form.append("voice", input.voice.file, voiceFileName(input.voice.mimeType))
  return form
}

export function sendMessage(
  conversationId: string,
  input: SendMessageInput
): Promise<Message> {
  const path = `${conversationPath(conversationId)}/messages`

  if (!input.images?.length && !input.voice) {
    return api.post<Message>(path, {
      id: input.id,
      body: input.body,
      replyToId: input.replyToId,
      giphyId: input.giphyId,
      stickerId: input.stickerId,
      giphyStickerId: input.giphyStickerId,
    })
  }

  return api.upload<Message>(path, messageUploadForm(input, "message"))
}

export function editMessage(
  conversationId: string,
  messageId: string,
  body: string
): Promise<Message> {
  return api.patch<Message>(messagePath(conversationId, messageId), { body })
}

export function deleteMessage(
  conversationId: string,
  messageId: string
): Promise<Message> {
  return api.del<Message>(messagePath(conversationId, messageId))
}

export function reactToMessage(
  conversationId: string,
  messageId: string,
  emoji: string
): Promise<Message> {
  return api.put<Message>(
    `${messagePath(conversationId, messageId)}/reaction`,
    { emoji }
  )
}

export function unreactToMessage(
  conversationId: string,
  messageId: string
): Promise<Message> {
  return api.del<Message>(`${messagePath(conversationId, messageId)}/reaction`)
}

export async function markConversationRead(id: string): Promise<void> {
  await api.post(`${conversationPath(id)}/read`)
}

export async function sendTyping(id: string): Promise<void> {
  await api.post(`${conversationPath(id)}/typing`)
}

export function revealSelf(id: string): Promise<Conversation> {
  return api.post<Conversation>(`${conversationPath(id)}/reveal`)
}

export async function blockGhost(id: string): Promise<void> {
  await api.post(`${conversationPath(id)}/block`)
}

export async function unblockGhost(id: string): Promise<void> {
  await api.post(`${conversationPath(id)}/unblock`)
}

export async function findConversationWith(
  userId: string
): Promise<string | null> {
  const result = await api.get<{ conversation_id: string | null }>(
    `/conversations/with/${encodeURIComponent(userId)}`
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
  page: number,
  conversationId?: string
): Promise<Paginated<MessageHit>> {
  return api.get<Paginated<MessageHit>>("/conversations/messages/search", {
    q,
    page,
    conversationId,
  })
}

export function wearChatTheme(
  conversationId: string,
  themeId: string | null
): Promise<Conversation> {
  return api.put<Conversation>(`${conversationPath(conversationId)}/theme`, {
    themeId,
  })
}

export function wearChatThemePhoto(
  conversationId: string,
  input: { themeId: string; image: PickedImage }
): Promise<Conversation> {
  const form = new FormData()
  form.append("themeId", input.themeId)
  appendImage(form, "image", input.image, "chat-theme")
  return api.upload<Conversation>(
    `${conversationPath(conversationId)}/theme/photo`,
    form
  )
}

export async function getAllChatsTheme(): Promise<WornTheme | null> {
  const { theme } = await api.get<{ theme: WornTheme | null }>(
    ALL_CHATS_THEME_PATH
  )
  return theme
}

export async function wearAllChatsTheme(
  themeId: string | null
): Promise<WornTheme | null> {
  const { theme } = await api.put<{ theme: WornTheme | null }>(
    ALL_CHATS_THEME_PATH,
    { themeId }
  )
  return theme
}

export async function wearAllChatsThemePhoto(input: {
  themeId: string
  image: PickedImage
}): Promise<WornTheme | null> {
  const form = new FormData()
  form.append("themeId", input.themeId)
  appendImage(form, "image", input.image, "chat-theme")
  const { theme } = await api.upload<{ theme: WornTheme | null }>(
    `${ALL_CHATS_THEME_PATH}/photo`,
    form
  )
  return theme
}

export async function muteConversation(id: string): Promise<void> {
  await api.put(`${conversationPath(id)}/mute`)
}

export async function unmuteConversation(id: string): Promise<void> {
  await api.del(`${conversationPath(id)}/mute`)
}

export function listConversationPhotos(
  id: string,
  page: number
): Promise<Paginated<ConversationPhoto>> {
  return api.get<Paginated<ConversationPhoto>>(
    `${conversationPath(id)}/photos`,
    { page }
  )
}

export async function getUnreadMessageCount(): Promise<number> {
  const result = await api.get<{ count: number }>("/conversations/unread-count")
  return result.count
}

export async function updateMessageSettings(
  settings: MessageSettings
): Promise<void> {
  await api.put("/conversations/settings", settings)
}

export function openPhoto(
  conversationId: string,
  messageId: string,
  photoId: string
): Promise<OpenedPhoto> {
  return api.post<OpenedPhoto>(
    `${messagePath(conversationId, messageId)}/photos/${encodeURIComponent(photoId)}/open`
  )
}
