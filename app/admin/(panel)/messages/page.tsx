import type { Metadata } from "next"
import { ConversationsScreen } from "@/features/admin/messages/screens/conversations-screen"

export const metadata: Metadata = { title: "Conversations" }

export default function Page() {
  return <ConversationsScreen />
}
