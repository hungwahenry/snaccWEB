import Link from "next/link"
import { memo } from "react"
import { PersonAvatar } from "@/features/users/components/person-avatar"
import { timeAgo } from "@/lib/format"
import { conversationPath } from "../../routes"
import type { MessageHit } from "../../types"
import { hitTitle, messagePreview } from "../../utils/preview"

function MessageHitRowComponent({ hit }: { hit: MessageHit }) {
  const { conversation, message } = hit

  return (
    <Link
      href={conversationPath(conversation.id)}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40 sm:px-6"
    >
      <PersonAvatar person={conversation.other} className="size-9" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="min-w-0 truncate text-sm font-bold text-foreground">
            {hitTitle(conversation, message.mine)}
          </span>
          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
            {timeAgo(message.created_at)}
          </span>
        </span>
        <span className="line-clamp-2 text-sm text-muted-foreground">
          {messagePreview(message)}
        </span>
      </span>
    </Link>
  )
}

export const MessageHitRow = memo(MessageHitRowComponent)
