export const messageKeys = {
  all: () => ["messages"] as const,
  conversationLists: () => ["messages", "conversations"] as const,
  conversations: (q: string) => ["messages", "conversations", q] as const,
  conversation: (id: string) => ["messages", "conversation", id] as const,
  thread: (id: string) => ["messages", "thread", id] as const,
  search: (q: string) => ["messages", "search", q] as const,
  unread: () => ["messages", "unread"] as const,
}
