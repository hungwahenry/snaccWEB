"use client"

import { timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "../types"

/// A room names who is speaking on the message that starts a run, unlike a DM where there are
/// only two people and the side of the thread says it.
export function ChatBubble({
  message,
  leadsRun,
  onRemove,
}: {
  message: ChatMessage
  leadsRun: boolean
  onRemove?: () => void
}) {
  const mine = message.mine

  if (message.deleted) {
    return (
      <div className={cn("px-4 py-1", mine ? "text-right" : "text-left")}>
        <span className="text-xs italic text-muted-foreground">
          {message.deleted_by_sender ? "Message withdrawn" : "Removed by a moderator"}
        </span>
      </div>
    )
  }

  return (
    <div className={cn("group flex flex-col gap-1 px-4 py-0.5", mine && "items-end")}>
      {leadsRun && !mine ? (
        <span className="flex items-center gap-1.5 pl-1 text-xs font-bold text-muted-foreground">
          <img src={message.sender.avatar_url} alt="" className="size-4 rounded-full" />
          {message.sender.username ?? message.sender.display_name ?? "Someone"}
        </span>
      ) : null}

      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-2xl px-3 py-2",
          mine ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {message.reply_to ? (
          <div
            className={cn(
              "rounded-lg border-l-2 px-2 py-1",
              mine ? "border-primary-foreground/50 bg-black/10" : "border-primary bg-black/5"
            )}
          >
            <p className="text-xs font-bold opacity-80">
              {message.reply_to.sender_username ?? "Someone"}
            </p>
            <p className="truncate text-xs opacity-80">
              {message.reply_to.deleted ? "Message withdrawn" : message.reply_to.body}
            </p>
          </div>
        ) : null}

        {message.images.map((image) => (
          <img
            key={image.id}
            src={image.thumb_url}
            alt=""
            className="max-w-[220px] rounded-xl"
          />
        ))}

        {message.body ? <p className="whitespace-pre-wrap">{message.body}</p> : null}

        <span className="flex items-center gap-2 text-[10px] opacity-70">
          {timeAgo(message.created_at)}
          {mine && onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="cursor-pointer underline opacity-0 transition group-hover:opacity-100"
            >
              withdraw
            </button>
          ) : null}
        </span>
      </div>
    </div>
  )
}
