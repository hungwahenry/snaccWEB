"use client"

import { useState } from "react"
import { ConfirmAction } from "@/components/admin/confirm-action"
import { ContentMedia } from "@/components/admin/content-media"
import { DetailHeader, Section } from "@/components/admin/detail"
import { UserInline } from "@/components/admin/user-inline"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { formatDate, handleOf, timeAgo } from "@/lib/format"
import type { useMessageModeration } from "../hooks/use-messages"
import type { AdminConversationDetail, AdminThreadMessage } from "../types"

function DeleteMessageDialog({
  message,
  actions,
}: {
  message: AdminThreadMessage
  actions: ReturnType<typeof useMessageModeration>
}) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="text-destructive">
            Remove
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove this message?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          It stays in the thread as a tombstone — both people see “This message
          was removed.”
        </p>
        <Field>
          <FieldLabel>Reason (optional)</FieldLabel>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            maxLength={500}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={actions.remove.isPending}
            onClick={() =>
              actions.remove.mutate(
                { id: message.id, reason: reason.trim() || undefined },
                { onSuccess: () => setOpen(false) }
              )
            }
          >
            Remove message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MessageRow({
  message,
  ghostId,
  actions,
}: {
  message: AdminThreadMessage
  ghostId: string
  actions: ReturnType<typeof useMessageModeration>
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
          <ConfirmAction
            label="Restore"
            variant="ghost"
            confirmVariant="default"
            title="Put this message back?"
            description="Both people in the thread will see it again."
            confirmLabel="Restore message"
            pending={actions.restore.isPending}
            onConfirm={(close) =>
              actions.restore.mutate(message.id, { onSuccess: close })
            }
          />
        ) : (
          <DeleteMessageDialog message={message} actions={actions} />
        )}
      </div>
    </div>
  )
}

export function ConversationThread({
  conversation,
  actions,
}: {
  conversation: AdminConversationDetail
  actions: ReturnType<typeof useMessageModeration>
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
            <span>{conversation.messages.length} messages</span>
            {conversation.revealed ? (
              <span>Revealed {formatDate(conversation.revealed_at)}</span>
            ) : null}
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border px-4 py-3">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Ghost (initiator)
          </p>
          <UserInline
            user={conversation.ghost}
            note={conversation.ghost.university?.name ?? undefined}
            className="mt-1.5"
          />
        </div>
        <div className="rounded-lg border px-4 py-3">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Target
          </p>
          <UserInline
            user={conversation.target}
            note={conversation.target.university?.name ?? undefined}
            className="mt-1.5"
          />
        </div>
      </div>

      <Section title="Messages">
        {conversation.messages.length === 0 ? (
          <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            No messages.
          </p>
        ) : (
          <div className="divide-y rounded-lg border">
            {conversation.messages.map((message) => (
              <MessageRow
                key={message.id}
                message={message}
                ghostId={conversation.ghost.id}
                actions={actions}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
