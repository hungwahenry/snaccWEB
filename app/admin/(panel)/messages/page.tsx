"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { ConversationsTable } from "@/features/admin/messages/components/conversations-table"
import { useConversations } from "@/features/admin/messages/hooks/use-messages"
import type { ListConversationsParams } from "@/features/admin/messages/types"

export default function MessagesPage() {
  const [params, setParams] = useState<ListConversationsParams>({
    page: 1,
    perPage: 20,
  })
  const query = useConversations(params)

  function patch(next: Partial<ListConversationsParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

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
