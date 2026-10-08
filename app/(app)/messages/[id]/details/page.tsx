import type { Metadata } from "next"
import { ConversationDetailsScreen } from "@/features/messages/screens/conversation-details-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Chat details" }

type Props = { params: Promise<{ id: string }> }

export default async function ConversationDetailsPage({ params }: Props) {
  const { id } = await params
  await requireSession(`/messages/${id}/details`)
  return <ConversationDetailsScreen id={id} />
}
