import { api } from "@/lib/api/client"
import type { AdminChatTheme, UpdateChatThemeInput } from "../types"

export function listChatThemes() {
  return api.get<AdminChatTheme[]>("/admin/chat-themes")
}

export function updateChatTheme(id: string, input: UpdateChatThemeInput) {
  return api.patch<AdminChatTheme>(`/admin/chat-themes/${id}`, input)
}
