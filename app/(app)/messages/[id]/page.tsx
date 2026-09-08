import type { Metadata } from "next"
import { ConversationScreen } from "@/features/messages/screens/conversation-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Conversation" }

type Props = { params: Promise<{ id: string }> }

export default async function ConversationPage({ params }: Props) {
  const { id } = await params
  await requireSession(`/messages/${id}`)
  return <ConversationScreen id={id} />
}
