export const messagesPath = "/messages"
export const conversationPath = (id: string) => `/messages/${id}`

export function newMessagePath(target: {
  id: string
  username: string | null
}): string {
  const search = new URLSearchParams({ targetId: target.id })
  if (target.username) search.set("username", target.username)
  return `/messages/new?${search.toString()}`
}
