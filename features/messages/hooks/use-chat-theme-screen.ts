"use client"

import { useBack } from "@/hooks/use-back"
import { conversationDetailsPath } from "../routes"
import { useAllChatsTheme } from "./use-all-chats-theme"
import { useConversation } from "./use-conversation"
import { APP_LOOK, useThemePicker } from "./use-theme-picker"
import { useWearChatTheme } from "./use-wear-chat-theme"

export function useChatThemeScreen(id: string) {
  const back = useBack(conversationDetailsPath(id))
  const query = useConversation(id)
  const allChats = useAllChatsTheme()
  const wear = useWearChatTheme(id, back)

  return useThemePicker({
    worn: query.data?.theme ?? null,
    ready: query.data !== undefined && !allChats.loading,
    failed: query.isError,
    retry: () => void query.refetch(),
    fallback: allChats.theme
      ? { label: "All chats", theme: allChats.theme }
      : APP_LOOK,
    onBack: back,
    wear,
  })
}
