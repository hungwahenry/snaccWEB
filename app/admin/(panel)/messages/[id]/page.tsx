"use client"

import { use } from "react"
import { DetailScreen } from "@/components/admin/detail-screen"
import { ConversationThread } from "@/features/admin/messages/conversation-thread"
import {
  useConversation,
  useMessageModeration,
} from "@/features/admin/messages/use-messages"

export default function MessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const query = useConversation(id)
  const actions = useMessageModeration(id)

  return (
    <DetailScreen
      backHref="/admin/messages"
      backLabel="Back to messages"
      missing="Couldn't load this thread."
      query={query}
    >
      {(conversation) => (
        <ConversationThread conversation={conversation} actions={actions} />
      )}
    </DetailScreen>
  )
}
