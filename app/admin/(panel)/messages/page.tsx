import type { Metadata } from "next"
import { ConversationsScreen } from "@/features/admin/messages/screens/conversations-screen"

export const metadata: Metadata = { title: "Ghost threads" }

export default function Page() {
  return <ConversationsScreen />
}
