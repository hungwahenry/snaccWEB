"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TableFrame } from "@/components/data-table/table-frame"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber, timeAgo } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import { UserInline } from "@/components/admin/user-inline"
import type { AdminConversationRow, ListConversationsParams } from "../types"

export function ConversationsTable({
  data,
  onParams,
}: {
  data: Paginated<AdminConversationRow>
  onParams: (patch: Partial<ListConversationsParams>) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <TableFrame
        page={data.page}
        perPage={data.per_page}
        total={data.total}
        onPageChange={(page) => onParams({ page })}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participants</TableHead>
              <TableHead>Mask</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Messages</TableHead>
              <TableHead>Last activity</TableHead>
              <TableHead className="text-right">Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No conversations yet.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((conversation) => (
                <TableRow key={conversation.id}>
                  <TableCell>
                    <span className="flex flex-wrap items-center gap-1.5">
                      <UserInline user={conversation.ghost} size="sm" />
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                      <UserInline user={conversation.target} size="sm" />
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    “{conversation.pseudonym}”
                  </TableCell>
                  <TableCell>
                    {conversation.revealed ? (
                      <Badge variant="outline">Revealed</Badge>
                    ) : (
                      <Badge variant="secondary">Anonymous</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {formatNumber(conversation.message_count)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {timeAgo(conversation.last_message_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <Link href={`/admin/messages/${conversation.id}`} />
                      }
                    >
                      Open thread
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableFrame>
    </div>
  )
}
