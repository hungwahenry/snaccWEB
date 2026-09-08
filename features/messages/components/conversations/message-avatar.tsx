import { UserAvatar } from "@/components/ui/user-avatar"
import { cn } from "@/lib/utils"
import type { MessageParty } from "../../types"

export function MessageAvatar({
  party,
  className,
}: {
  party: MessageParty
  className?: string
}) {
  return (
    <UserAvatar
      alt={party.display_name ?? "Ghost"}
      className={cn("size-12", className)}
      avatarUrl={party.avatar_url}
      name={party.display_name}
    />
  )
}
