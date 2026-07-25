import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { MessageAuthor } from "./types"

export function handleOf(author: MessageAuthor): string {
  if (author.username) return `@${author.username}`
  return author.display_name ?? "unknown"
}

export function AuthorInline({ author, className }: { author: MessageAuthor; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <Avatar className="size-5">
        <AvatarImage src={author.avatar_url} alt="" />
        <AvatarFallback className="text-[10px]">
          {(author.username ?? author.display_name ?? "?").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="truncate text-sm font-medium">{handleOf(author)}</span>
    </span>
  )
}
