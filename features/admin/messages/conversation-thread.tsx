"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { formatDate, timeAgo } from "@/lib/format"
import { handleOf } from "./author-inline"
import type { useMessageModeration } from "./use-messages"
import type { AdminConversationDetail, AdminThreadMessage, MessageAuthor } from "./types"

function Party({ label, author, note }: { label: string; author: MessageAuthor; note?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9">
        <AvatarImage src={author.avatar_url} alt="" />
        <AvatarFallback>
          {(author.username ?? author.display_name ?? "?").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
        <p className="truncate text-sm font-semibold">{handleOf(author)}</p>
        {note ? <p className="text-muted-foreground truncate text-xs">{note}</p> : null}
      </div>
    </div>
  )
}

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
        <p className="text-muted-foreground text-sm">
          It stays in the thread as a tombstone — both people see “This message was removed.”
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
                { onSuccess: () => setOpen(false) },
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
    <div className="border-border/60 flex gap-3 border-b py-3 last:border-b-0">
      <Avatar className="mt-0.5 size-8">
        <AvatarImage src={message.sender.avatar_url} alt="" />
        <AvatarFallback>
          {(message.sender.username ?? "?").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{handleOf(message.sender)}</span>
          <Badge variant="outline" className="text-[10px]">
            {isGhost ? "ghost" : "target"}
          </Badge>
          <span className="text-muted-foreground text-xs">{timeAgo(message.created_at)}</span>
          {removed ? (
            <Badge variant="secondary" className="text-[10px]">
              removed
            </Badge>
          ) : null}
        </div>

        {message.reply_to ? (
          <p className="text-muted-foreground border-border mt-1 border-l-2 pl-2 text-xs italic">
            {message.reply_to.removed ? "Removed message" : message.reply_to.body}
          </p>
        ) : null}

        <p className={`mt-1 whitespace-pre-wrap text-sm ${removed ? "text-muted-foreground line-through" : ""}`}>
          {message.body}
        </p>
      </div>

      <div className="shrink-0">
        {removed ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={actions.restore.isPending}
            onClick={() => actions.restore.mutate(message.id)}
          >
            Restore
          </Button>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thread</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Party label="Ghost (initiator)" author={conversation.ghost} note={`Shown as “${conversation.pseudonym}”`} />
            <Party label="Target" author={conversation.target} />
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span>
              {conversation.revealed
                ? `Revealed ${formatDate(conversation.revealed_at)}`
                : "Ghost is still anonymous to the target"}
            </span>
            <span>Started {formatDate(conversation.created_at)}</span>
            <span>{conversation.messages.length} messages</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {conversation.messages.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">No messages.</p>
          ) : (
            conversation.messages.map((message) => (
              <MessageRow
                key={message.id}
                message={message}
                ghostId={conversation.ghost.id}
                actions={actions}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
