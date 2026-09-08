import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/ui/user-avatar"
import { TierName } from "@/features/users/components/flair"
import { ProfileLink } from "@/features/users/components/profile-link"
import type { SnaccResnaccer } from "../../types"

export function ResnaccerRow({ resnaccer }: { resnaccer: SnaccResnaccer }) {
  const { user } = resnaccer

  return (
    <ProfileLink
      username={user.username}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
    >
      <UserAvatar
        alt={user.display_name ?? "Resnaccer"}
        avatarUrl={user.avatar_url}
        name={user.username}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <TierName
            score={user.score}
            official={user.official}
            birthday={user.is_birthday}
            name={user.display_name ?? user.username}
            className="font-bold text-foreground"
          />
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          @{user.username}
        </span>
      </span>
    </ProfileLink>
  )
}

export function ResnaccerRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="size-11 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}
