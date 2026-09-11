"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { MESSAGES_PATH } from "@/features/admin/shell/routes"
import { ConversationThread } from "../components/conversation-thread"
import { useConversationScreen } from "../hooks/use-conversation-screen"

export function ConversationScreen({ id }: { id: string }) {
  const { query, actions } = useConversationScreen(id)

  return (
    <>
      <BackLink href={MESSAGES_PATH} label="Back to messages" />
      <QueryView query={query} what="this thread">
        {(conversation) => (
          <ConversationThread
            conversation={conversation}
            onRemove={actions.remove}
            onRestore={actions.restore}
          />
        )}
      </QueryView>
    </>
  )
}
