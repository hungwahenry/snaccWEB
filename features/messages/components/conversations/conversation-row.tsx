import Link from "next/link"
import { memo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PersonAvatar } from "@/features/users/components/person-avatar"
import { timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"
import { conversationPath } from "../../routes"
import type { Conversation } from "../../types"
import { conversationPreview, partyName } from "../../utils/preview"
import { StreakFlame } from "./streak-flame"

function ConversationRowComponent({
  conversation,
}: {
  conversation: Conversation
}) {
  const unread = conversation.has_unread

  return (
    <Link
      href={conversationPath(conversation.id)}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40 active:opacity-70 sm:px-6"
    >
      <PersonAvatar person={conversation.other} className="size-12" />

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
          <span className="ml-auto flex shrink-0 items-center gap-2">
            <StreakFlame days={conversation.streak} />
            <span className="text-xs text-muted-foreground">
              {timeAgo(conversation.last_message_at)}
            </span>
          </span>
        </span>

        <span className="flex items-center gap-2">
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm",
              unread ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            {conversationPreview(conversation)}
          </span>
          {unread ? (
            <span
              aria-label="Unread"
              className="size-2 shrink-0 rounded-full bg-primary"
            />
          ) : null}
        </span>
      </span>
    </Link>
  )
}

export const ConversationRow = memo(ConversationRowComponent)

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
