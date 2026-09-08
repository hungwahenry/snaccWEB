"use client"

import { DetailScreen } from "@/features/admin/shell/ui/detail-screen"
import { ConversationThread } from "@/features/admin/messages/components/conversation-thread"
import {
  useConversation,
  useMessageModeration,
} from "@/features/admin/messages/hooks/use-messages"

export function ConversationScreen({ id }: { id: string }) {
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
