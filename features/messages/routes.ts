export const MESSAGES_PATH = "/messages"

export const conversationPath = (id: string) =>
  `${MESSAGES_PATH}/${encodeURIComponent(id)}`

export const messageInConversationPath = (id: string, messageId: string) =>
  `${conversationPath(id)}?message=${encodeURIComponent(messageId)}`

export const conversationDetailsPath = (id: string) =>
  `${conversationPath(id)}/details`

export const chatThemePath = (id: string) => `${conversationPath(id)}/theme`

export const conversationPhotosPath = (id: string) =>
  `${conversationPath(id)}/photos`

export const conversationSearchPath = (id: string) =>
  `${conversationPath(id)}/search`

export function newMessagePath(target: {
  id: string
  username: string | null
}): string {
  const search = new URLSearchParams({ targetId: target.id })
  if (target.username) search.set("username", target.username)
  return `${MESSAGES_PATH}/new?${search.toString()}`
}
