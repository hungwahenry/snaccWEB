import type { Metadata } from "next"
import { ConversationScreen } from "@/features/admin/messages/screens/conversation-screen"

export const metadata: Metadata = { title: "Conversation" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ConversationScreen id={id} />
}
