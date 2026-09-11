import type { Metadata } from "next"
import { MessagesScreen } from "@/features/messages/screens/messages-screen"
import { MESSAGES_PATH } from "@/features/messages/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "DMs" }

export default async function MessagesPage() {
  await requireSession(MESSAGES_PATH)
  return <MessagesScreen />
}
