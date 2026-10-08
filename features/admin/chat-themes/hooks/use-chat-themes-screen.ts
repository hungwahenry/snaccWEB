"use client"

import { useChatThemeActions, useAdminChatThemes } from "./use-chat-themes"

export function useChatThemesScreen() {
  return { query: useAdminChatThemes(), actions: useChatThemeActions() }
}
