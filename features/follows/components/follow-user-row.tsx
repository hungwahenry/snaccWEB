import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/ui/user-avatar"
import { TierName } from "@/features/users/components/flair"
import { profilePath } from "@/features/users/routes"
import type { FollowUser } from "../types"

type FollowUserRowProps = {
  user: FollowUser
  isMe: boolean
  onToggleFollow: () => void
}

export function FollowUserRow({
  user,
  isMe,
  onToggleFollow,
}: FollowUserRowProps) {
  const href = profilePath(user.username)

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Link href={href} className="shrink-0">
        <UserAvatar
          alt={user.display_name ?? "User"}
          avatarUrl={user.avatar_url}
          name={user.username}
        />
      </Link>

      <Link href={href} className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <TierName
            score={user.score}
            official={user.official}
            birthday={user.is_birthday}
            name={user.display_name ?? user.username}
            className="truncate font-extrabold text-foreground"
          />
          {user.follows_you ? (
            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
              Follows you
            </span>
          ) : null}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          @{user.username}
          {user.university ? ` · ${user.university.acronym}` : ""}
        </span>
      </Link>

      {isMe ? null : (
        <Button
          variant={user.is_following ? "outline" : "default"}
          size="sm"
          onClick={onToggleFollow}
        >
          {user.is_following
            ? "Following"
            : user.follows_you
              ? "Follow back"
              : "Follow"}
        </Button>
      )}
    </div>
  )
}

export function FollowUserRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="size-11 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-8 w-24 rounded-full" />
    </div>
  )
}
