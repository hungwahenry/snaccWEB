"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { ContentMedia } from "@/features/admin/shell/components/content-media"
import {
  DetailHeader,
  EmptyNote,
  Section,
} from "@/features/admin/shell/components/detail"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { plural } from "@/features/admin/shell/utils/format"
import { formatDate, handleOf, timeAgo } from "@/lib/format"
import type {
  AdminConversationDetail,
  AdminThreadMessage,
  MessageAuthor,
} from "../types"

type RemoveMessage = (id: string, reason?: string) => Promise<unknown>
type RestoreMessage = (id: string) => Promise<unknown>

function MessageRow({
  message,
  ghostId,
  onRemove,
  onRestore,
}: {
  message: AdminThreadMessage
  ghostId: string
  onRemove: RemoveMessage
  onRestore: RestoreMessage
}) {
  const removed = message.deleted_at !== null
  const isGhost = message.sender.id === ghostId

  return (
    <div className="flex gap-3 px-4 py-3">
      <Avatar className="mt-0.5 size-8 shrink-0">
        <AvatarImage src={message.sender.avatar_url} alt="" />
        <AvatarFallback className="text-xs">
          {(message.sender.username ?? "?").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">
            {handleOf(message.sender)}
          </span>
          <Badge variant="outline" className="text-[10px]">
            {isGhost ? "ghost" : "target"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {timeAgo(message.created_at)}
          </span>
          {message.edited_at ? (
            <span className="text-xs text-muted-foreground">edited</span>
          ) : null}
          {removed ? (
            <Badge variant="secondary" className="text-[10px]">
              removed
            </Badge>
          ) : null}
        </div>

        {message.reply_to ? (
          <p className="border-l-2 border-border pl-2 text-xs text-muted-foreground italic">
            {message.reply_to.removed
              ? "Removed message"
              : message.reply_to.body}
          </p>
        ) : null}

        {message.body ? (
          <p
            className={`text-sm whitespace-pre-wrap ${removed ? "text-muted-foreground line-through" : ""}`}
          >
            {message.body}
          </p>
        ) : null}

        <ContentMedia
          images={message.images}
          gif={message.gif}
          sticker={message.sticker}
        />
      </div>

      <div className="shrink-0">
        {removed ? (
          <CanAct permission="messages.restore">
            <ConfirmAction
              trigger={
                <Button variant="ghost" size="sm">
                  Restore
                </Button>
              }
              tone="default"
              title="Put this message back?"
              description="Both people in the thread will see it again."
              confirmLabel="Restore message"
              onConfirm={() => onRestore(message.id)}
            />
          </CanAct>
        ) : (
          <CanAct permission="messages.delete">
            <ConfirmAction
              trigger={
                <Button variant="ghost" size="sm" className="text-destructive">
                  Remove
                </Button>
              }
              title="Remove this message?"
              description="It stays in the thread as a tombstone — both people see “This message was removed.”"
              confirmLabel="Remove message"
              reason={{ label: "Reason" }}
              onConfirm={(reason) => onRemove(message.id, reason)}
            />
          </CanAct>
        )}
      </div>
    </div>
  )
}

function Participant({ label, user }: { label: string; user: MessageAuthor }) {
  return (
    <div className="rounded-lg border px-4 py-3">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <UserCell
        user={user}
        note={user.university?.name ?? undefined}
        className="mt-1.5"
      />
    </div>
  )
}

export function ConversationThread({
  conversation,
  onRemove,
  onRestore,
}: {
  conversation: AdminConversationDetail
  onRemove: RemoveMessage
  onRestore: RestoreMessage
}) {
  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title="Ghost thread"
        badges={
          conversation.revealed ? (
            <Badge variant="outline">Revealed</Badge>
          ) : (
            <Badge variant="secondary">Still anonymous</Badge>
          )
        }
        subtitle={`The target sees the sender as “${conversation.pseudonym}”.`}
        meta={
          <>
            <span>Started {formatDate(conversation.created_at)}</span>
            <span>{plural(conversation.messages.length, "message")}</span>
            {conversation.revealed ? (
              <span>Revealed {formatDate(conversation.revealed_at)}</span>
            ) : null}
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Participant label="Ghost (initiator)" user={conversation.ghost} />
        <Participant label="Target" user={conversation.target} />
      </div>

      <Section title="Messages">
        {conversation.messages.length === 0 ? (
          <EmptyNote>No messages.</EmptyNote>
        ) : (
          <div className="divide-y rounded-lg border">
            {conversation.messages.map((message) => (
              <MessageRow
                key={message.id}
                message={message}
                ghostId={conversation.ghost.id}
                onRemove={onRemove}
                onRestore={onRestore}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
