import type { Metadata } from "next"
import { ChatThemesScreen } from "@/features/admin/chat-themes/screens/chat-themes-screen"

export const metadata: Metadata = { title: "Chat themes" }

export default function Page() {
  return <ChatThemesScreen />
}
