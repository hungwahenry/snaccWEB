export const CONVERSATIONS_KEY = ["messages", "conversations"]
export const UNREAD_MESSAGES_KEY = ["messages", "unread"]
export const conversationKey = (id: string) => ["messages", "conversation", id]
export const messagesKey = (id: string) => ["messages", "thread", id]
