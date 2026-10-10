"use client"

import { SETTINGS_PATH } from "@/features/settings/routes"
import { useBack } from "@/hooks/use-back"
import { useAllChatsTheme } from "./use-all-chats-theme"
import { APP_LOOK, useThemePicker } from "./use-theme-picker"
import { useWearAllChatsTheme } from "./use-wear-all-chats-theme"

export function useAllChatsThemeScreen() {
  const back = useBack(SETTINGS_PATH)
  const allChats = useAllChatsTheme()
  const wear = useWearAllChatsTheme(back)

  return useThemePicker({
    worn: allChats.theme,
    ready: allChats.loaded,
    failed: allChats.failed,
    retry: () => void allChats.refetch(),
    fallback: APP_LOOK,
    onBack: back,
    wear,
  })
}
