import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { NewMessageScreen } from "@/features/messages/screens/new-message-screen"
import { MESSAGES_PATH } from "@/features/messages/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "New message" }

type Props = { searchParams: Promise<{ targetId?: string; username?: string }> }

export default async function NewMessagePage({ searchParams }: Props) {
  await requireSession(MESSAGES_PATH)
  const { targetId, username } = await searchParams
  if (!targetId) redirect("/messages")

  return <NewMessageScreen targetId={targetId} username={username || null} />
}
