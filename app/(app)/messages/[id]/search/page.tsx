import type { Metadata } from "next"
import { ConversationSearchScreen } from "@/features/messages/screens/conversation-search-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Search this chat" }

type Props = { params: Promise<{ id: string }> }

export default async function ConversationSearchPage({ params }: Props) {
  const { id } = await params
  await requireSession(`/messages/${id}/search`)
  return <ConversationSearchScreen id={id} />
}
