export const chatKeys = {
  rooms: () => ["chats", "rooms"] as const,
  messages: (roomId: string) => ["chats", "messages", roomId] as const,
  reactors: (messageId: string, emoji: string | null) =>
    ["chats", "reactors", messageId, emoji] as const,
}
