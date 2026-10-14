"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { Trash2, Undo2 } from "lucide-react"
import { useMemo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { ContentMedia } from "@/features/admin/shell/components/content-media"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import type { Paginated } from "@/lib/api/types"
import { timeAgo } from "@/lib/format"
import type { AdminRoomMessage } from "../types"
import { messageStates } from "../utils/rooms"

export function RoomMessagesTable({
  query,
  toolbar,
  onPageChange,
  onRelease,
  onRemove,
}: {
  query: UseQueryResult<Paginated<AdminRoomMessage>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onRelease: (id: string) => Promise<unknown>
  onRemove: (id: string, reason?: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminRoomMessage>[]>(
    () => [
      {
        id: "message",
        header: "Message",
        className: "max-w-lg whitespace-normal",
        cell: (message) => (
          <div className="flex min-w-0 flex-col gap-1.5">
            {message.reply_to ? (
              <p className="line-clamp-2 border-l-2 border-border pl-2 text-xs text-muted-foreground italic">
                {message.reply_to.removed
                  ? "Removed message"
                  : (message.reply_to.body ?? "Attachment")}
              </p>
            ) : null}
            {message.body ? (
              <p
                className={
                  message.deleted_at
                    ? "text-sm whitespace-pre-wrap text-muted-foreground line-through"
                    : "text-sm whitespace-pre-wrap"
                }
              >
                {message.body}
              </p>
            ) : null}
            <ContentMedia
              images={message.images}
              gif={message.gif}
              sticker={message.sticker}
              voice={message.voice}
            />
          </div>
        ),
      },
      {
        id: "sender",
        header: "From",
        cell: (message) => <UserCell user={message.sender} size="sm" />,
      },
      {
        id: "sent",
        header: "Sent",
        hideBelow: "md",
        className: "whitespace-nowrap text-muted-foreground",
        cell: (message) => (
          <>
            {timeAgo(message.created_at)}
            {message.edited_at ? " · edited" : null}
          </>
        ),
      },
      {
        id: "state",
        header: "State",
        cell: (message) => (
          <div className="flex flex-wrap gap-1">
            {messageStates(message).map((state) => (
              <StatusBadge key={state.label} status={state} />
            ))}
          </div>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (message) =>
          message.deleted_at ? null : (
            <div className="flex justify-end gap-1">
              {message.held_at ? (
                <CanAct permission="chats.delete">
                  <ConfirmAction
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Undo2 />
                        Release
                      </Button>
                    }
                    tone="default"
                    title="Put this message back in the room?"
                    description="Everyone in the room can see it again."
                    confirmLabel="Release it"
                    onConfirm={() => onRelease(message.id)}
                  />
                </CanAct>
              ) : null}
              <CanAct permission="chats.delete">
                <ConfirmAction
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Trash2 />
                      Remove
                    </Button>
                  }
                  title="Remove this message?"
                  description="It goes from the room for everyone and the sender is told. The record stays here."
                  confirmLabel="Remove it"
                  reason={{ label: "Reason" }}
                  onConfirm={(reason) => onRemove(message.id, reason)}
                />
              </CanAct>
            </div>
          ),
      },
    ],
    [onRelease, onRemove]
  )

  return (
    <QueryTable
      query={query}
      what="messages"
      columns={columns}
      rowKey={(message) => message.id}
      empty="No messages match that."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
