import type { Metadata } from "next"
import { chatRoomPath } from "@/features/chats/routes"
import { ChatRoomScreen } from "@/features/chats/screens/chat-room-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Room" }

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireSession(chatRoomPath(id))

  return <ChatRoomScreen roomId={id} />
}
