import { api } from "@/lib/api/client"
import type { ChatTheme } from "../types"

export function listChatThemes(): Promise<ChatTheme[]> {
  return api.get<ChatTheme[]>("/chat-themes")
}
