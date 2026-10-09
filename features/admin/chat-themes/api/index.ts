import { api } from "@/lib/api/client"
import type {
  AdminChatTheme,
  CreateChatThemeInput,
  UpdateChatThemeInput,
} from "../types"

export function listChatThemes() {
  return api.get<AdminChatTheme[]>("/admin/chat-themes")
}

export function createChatTheme(input: CreateChatThemeInput) {
  return api.post<AdminChatTheme>("/admin/chat-themes", input)
}

export function updateChatTheme(id: string, input: UpdateChatThemeInput) {
  return api.patch<AdminChatTheme>(`/admin/chat-themes/${id}`, input)
}

export function uploadChatThemeImage(id: string, file: File) {
  const form = new FormData()
  form.append("image", file)

  return api.upload<AdminChatTheme>(`/admin/chat-themes/${id}/image`, form)
}

export function deleteChatTheme(id: string) {
  return api.del<null>(`/admin/chat-themes/${id}`)
}
