import type { Metadata } from "next"
import { AnonChat } from "@/features/anon/anon-chat"

export const metadata: Metadata = {
  title: "Anonymous chat",
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ id: string }> }

export default async function AnonChatPage({ params }: Props) {
  const { id } = await params
  return <AnonChat conversationId={id} />
}
