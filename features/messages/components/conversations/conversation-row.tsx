import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"
import { conversationPath } from "../../routes"
import type { Conversation } from "../../types"
import { conversationPreview, partyName } from "../../utils/preview"
import { MessageAvatar } from "./message-avatar"
import { StreakFlame } from "./streak-flame"

export function ConversationRow({
  conversation,
}: {
  conversation: Conversation
}) {
  return (
    <Link
      href={conversationPath(conversation.id)}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40 active:opacity-70 sm:px-6"
    >
      <MessageAvatar party={conversation.other} />

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="min-w-0 truncate text-base font-bold text-foreground">
            {partyName(conversation)}
          </span>
          {conversation.you_are_ghost && !conversation.revealed ? (
            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              Anonymous
            </span>
          ) : null}
          <StreakFlame days={conversation.streak} className="ml-auto" />
          <span
            className={cn(
              "shrink-0 text-xs text-muted-foreground",
              conversation.streak > 0 ? undefined : "ml-auto"
            )}
          >
            {timeAgo(conversation.last_message_at)}
          </span>
        </span>

        <span className="flex items-center gap-2">
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm",
              conversation.has_unread
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {conversationPreview(conversation)}
          </span>
          {conversation.has_unread ? (
            <span className="size-2 shrink-0 rounded-full bg-primary" />
          ) : null}
        </span>
      </span>
    </Link>
  )
}

export function ConversationRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-3 w-8 rounded-full" />
        </div>
        <Skeleton className="h-3.5 w-52 rounded-full" />
      </div>
    </div>
  )
}
