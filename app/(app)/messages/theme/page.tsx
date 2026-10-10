import type { Metadata } from "next"
import { ALL_CHATS_THEME_PATH } from "@/features/messages/routes"
import { AllChatsThemeScreen } from "@/features/messages/screens/all-chats-theme-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Chat theme" }

export default async function AllChatsThemePage() {
  await requireSession(ALL_CHATS_THEME_PATH)
  return <AllChatsThemeScreen />
}
