import { CheckIcon, MessageCircleIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { Conversation } from "@/features/messages/types"
import { cn } from "@/lib/utils"
import { nameOf } from "@/features/users/utils/names"
import { RecipientGridSkeleton } from "./recipient-grid-skeleton"

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
  if (loading) return <RecipientGridSkeleton />

  if (conversations.length === 0) {
    return (
      <EmptyState
        compact
        icon={MessageCircleIcon}
        title="Nobody to send to yet"
        description="Start a chat with someone, then share it here."
      />
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
                alt={nameOf(person)}
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
