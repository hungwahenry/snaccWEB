"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { ConversationsTable } from "../components/conversations-table"
import { useConversationsScreen } from "../hooks/use-conversations-screen"

export function ConversationsScreen() {
  const { list, query } = useConversationsScreen()

  return (
    <>
      <PageHeader
        title="Messages"
        description="Anonymous direct-message threads — de-masked for moderation."
      />
      <ConversationsTable query={query} onPageChange={list.setPage} />
    </>
  )
}
