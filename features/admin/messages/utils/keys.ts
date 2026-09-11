import type { ConversationListQuery } from "../types"

export const adminMessageKeys = {
  all: () => ["admin", "messages"] as const,
  list: (query: ConversationListQuery) =>
    ["admin", "messages", "list", query] as const,
  thread: (id: string) => ["admin", "messages", "thread", id] as const,
}
