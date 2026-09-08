import type { UserRef } from "@/lib/api/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export type CellUser = UserRef | null

export function UserCell({ user }: { user: CellUser }) {
  if (!user) return <span className="text-sm text-muted-foreground">—</span>

  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-7">
        <AvatarImage src={user.avatar_url} alt="" />
        <AvatarFallback>
          {(user.display_name ?? user.username ?? "?")
            .slice(0, 1)
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {user.display_name ?? "Unnamed"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          @{user.username ?? "—"}
        </p>
      </div>
    </div>
  )
}
