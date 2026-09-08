import { CheckIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { Conversation } from "@/features/messages/types"
import { cn } from "@/lib/utils"

export function RecipientGrid({
  conversations,
  loading,
  picked,
  onToggle,
}: {
  conversations: Conversation[]
  loading: boolean
  picked: string[]
  onToggle: (conversationId: string) => void
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-y-2">
        {Array.from({ length: 8 }, (_, cell) => (
          <div
            key={cell}
            className="flex flex-col items-center gap-1.5 px-1 py-2"
          >
            <Skeleton className="size-16 rounded-full" />
            <Skeleton className="h-2.5 w-12 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <p className="py-3 text-sm text-muted-foreground">
        Nobody to send to yet. Start a chat first.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-y-2">
      {conversations.map((conversation) => {
        const person = conversation.other
        const on = picked.includes(conversation.id)
        return (
          <button
            key={conversation.id}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(conversation.id)}
            className="flex flex-col items-center gap-1.5 px-1 py-2 active:opacity-70"
          >
            <span className="relative">
              <UserAvatar
                className="size-16"
                alt={person.display_name ?? "Avatar"}
                avatarUrl={person.avatar_url}
                name={person.username}
              />
              {on ? (
                <span className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full border-2 border-popover bg-primary">
                  <CheckIcon className="size-3.5 text-primary-foreground" />
                </span>
              ) : null}
            </span>
            <span
              className={cn(
                "w-full truncate text-center text-xs",
                on ? "font-bold text-foreground" : "text-muted-foreground"
              )}
            >
              {person.username ?? "Someone"}
            </span>
          </button>
        )
      })}
    </div>
  )
}
