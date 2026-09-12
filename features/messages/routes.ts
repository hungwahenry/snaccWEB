export const MESSAGES_PATH = "/messages"

export const conversationPath = (id: string) =>
  `${MESSAGES_PATH}/${encodeURIComponent(id)}`

export function newMessagePath(target: {
  id: string
  username: string | null
}): string {
  const search = new URLSearchParams({ targetId: target.id })
  if (target.username) search.set("username", target.username)
  return `${MESSAGES_PATH}/new?${search.toString()}`
}
