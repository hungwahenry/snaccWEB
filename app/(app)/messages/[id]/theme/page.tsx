import type { Metadata } from "next"
import { ChatThemeScreen } from "@/features/messages/screens/chat-theme-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Chat theme" }

type Props = { params: Promise<{ id: string }> }

export default async function ChatThemePage({ params }: Props) {
  const { id } = await params
  await requireSession(`/messages/${id}/theme`)
  return <ChatThemeScreen id={id} />
}
