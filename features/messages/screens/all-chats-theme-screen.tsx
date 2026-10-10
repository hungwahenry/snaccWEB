"use client"

import { ThemePicker } from "../components/themes/theme-picker"
import { useAllChatsThemeScreen } from "../hooks/use-all-chats-theme-screen"

export function AllChatsThemeScreen() {
  return (
    <ThemePicker
      subtitle="Every chat without its own · only you see it"
      screen={useAllChatsThemeScreen()}
    />
  )
}
