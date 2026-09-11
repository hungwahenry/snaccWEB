import type { UseQueryResult } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { threadPath } from "@/features/admin/shell/routes"
import type { Paginated } from "@/lib/api/types"
import { formatNumber, timeAgo } from "@/lib/format"
import type { AdminConversationRow } from "../types"

const COLUMNS: Column<AdminConversationRow>[] = [
  {
    id: "participants",
    header: "Participants",
    cell: (conversation) => (
      <span className="flex flex-wrap items-center gap-1.5">
        <UserCell user={conversation.ghost} size="sm" />
        <ArrowRight className="size-3.5 text-muted-foreground" />
        <UserCell user={conversation.target} size="sm" />
      </span>
    ),
  },
  {
    id: "mask",
    header: "Mask",
    className: "text-muted-foreground",
    cell: (conversation) => `“${conversation.pseudonym}”`,
  },
  {
    id: "state",
    header: "State",
    cell: (conversation) =>
      conversation.revealed ? (
        <Badge variant="outline">Revealed</Badge>
      ) : (
        <Badge variant="secondary">Anonymous</Badge>
      ),
  },
  {
    id: "messages",
    header: "Messages",
    align: "end",
    className: "tabular-nums",
    cell: (conversation) => formatNumber(conversation.message_count),
  },
  {
    id: "last",
    header: "Last activity",
    className: "text-muted-foreground",
    cell: (conversation) => timeAgo(conversation.last_message_at),
  },
  {
    id: "review",
    header: "Review",
    align: "end",
    cell: (conversation) => (
      <Button
        variant="outline"
        size="sm"
        render={<Link href={threadPath(conversation.id)} />}
      >
        Open thread
      </Button>
    ),
  },
]

export function ConversationsTable({
  query,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<AdminConversationRow>>
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="conversations"
      columns={COLUMNS}
      rowKey={(conversation) => conversation.id}
      empty="No conversations yet."
      onPageChange={onPageChange}
    />
  )
}
