import type { ReactNode } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { SnaccAuthor } from "@/features/snaccs/types"
import { cn } from "@/lib/utils"
import { TierName } from "./flair"
import { ProfileLink } from "./profile-link"

type UserRowProps = {
  user: SnaccAuthor
  trailing?: ReactNode
  className?: string
}

export function UserRow({ user, trailing, className }: UserRowProps) {
  return (
    <div className={cn("flex items-center gap-3 py-2.5", className)}>
      <ProfileLink username={user.username} className="shrink-0">
        <UserAvatar
          alt={user.display_name ?? "User"}
          avatarUrl={user.avatar_url}
          name={user.username}
          className="size-10"
        />
      </ProfileLink>

      <ProfileLink username={user.username} className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <TierName
            score={user.score}
            official={user.official}
            birthday={user.is_birthday}
            name={user.display_name ?? user.username}
            className="font-bold text-foreground"
          />
        </span>
        {user.username ? (
          <span className="block truncate text-sm text-muted-foreground">
            @{user.username}
          </span>
        ) : null}
      </ProfileLink>

      {trailing}
    </div>
  )
}

export function UserRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}
