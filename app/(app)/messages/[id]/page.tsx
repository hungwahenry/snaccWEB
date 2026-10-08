import type { Metadata } from "next"
import { ConversationScreen } from "@/features/messages/screens/conversation-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Conversation" }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ message?: string }>
}

export default async function ConversationPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params
  const { message } = await searchParams
  await requireSession(`/messages/${id}`)
  return <ConversationScreen id={id} focusId={message || null} />
}
