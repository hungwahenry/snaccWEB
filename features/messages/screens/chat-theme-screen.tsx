"use client"

import { ThemePicker } from "../components/themes/theme-picker"
import { useChatThemeScreen } from "../hooks/use-chat-theme-screen"

export function ChatThemeScreen({ id }: { id: string }) {
  return (
    <ThemePicker subtitle="Only you see it" screen={useChatThemeScreen(id)} />
  )
}
