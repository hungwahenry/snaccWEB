"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { ConversationsTable } from "../components/conversations-table"
import { useConversationsScreen } from "../hooks/use-conversations-screen"

export function ConversationsScreen() {
  const { list, query } = useConversationsScreen()

  return (
    <>
      <PageHeader
        title="Ghost threads"
        description="Anonymous direct-message threads, unmasked for moderation."
      />
      <ConversationsTable
        query={query}
        onPageChange={list.setPage}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search a username, email or mask…"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
