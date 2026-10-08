import type { Metadata } from "next"
import { ConversationPhotosScreen } from "@/features/messages/screens/conversation-photos-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Chat photos" }

type Props = { params: Promise<{ id: string }> }

export default async function ConversationPhotosPage({ params }: Props) {
  const { id } = await params
  await requireSession(`/messages/${id}/photos`)
  return <ConversationPhotosScreen id={id} />
}
