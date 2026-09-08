import type { Metadata } from "next"
import { MessagesScreen } from "@/features/messages/screens/messages-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "DMs" }

export default async function MessagesPage() {
  await requireSession("/messages")
  return <MessagesScreen />
}
