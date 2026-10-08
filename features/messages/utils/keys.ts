export const messageKeys = {
  all: () => ["messages"] as const,
  conversationLists: () => ["messages", "conversations"] as const,
  conversations: (q: string) => ["messages", "conversations", q] as const,
  conversation: (id: string) => ["messages", "conversation", id] as const,
  conversationWith: (userId: string) => ["messages", "with", userId] as const,
  thread: (id: string) => ["messages", "thread", id] as const,
  search: (q: string, conversationId?: string) =>
    ["messages", "search", conversationId ?? "all", q] as const,
  photos: (id: string) => ["messages", "photos", id] as const,
  unread: () => ["messages", "unread"] as const,
}
