"use client"

import { useConversationsScreen } from "@/features/admin/messages/hooks/use-conversations-screen"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { ConversationsTable } from "@/features/admin/messages/components/conversations-table"

export function ConversationsScreen() {
  const { patch, query } = useConversationsScreen()

  return (
    <>
      <PageHeader
        title="Messages"
        description="Anonymous direct-message threads — de-masked for moderation."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load conversations.
        </p>
      ) : (
        <ConversationsTable data={query.data} onParams={patch} />
      )}
    </>
  )
}
