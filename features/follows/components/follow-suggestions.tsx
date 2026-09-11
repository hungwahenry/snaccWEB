import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/ui/user-avatar"
import { profilePath } from "@/features/users/routes"
import type { FollowUser } from "../types"
import { nameOf } from "@/features/users/utils/names"

export function FollowSuggestions({
  users,
  onToggleFollow,
}: {
  users: FollowUser[]
  onToggleFollow: (user: FollowUser) => void
}) {
  if (users.length === 0) return null

  return (
    <section className="flex flex-col gap-2.5">
      <Eyebrow className="px-1">People to follow</Eyebrow>
      <div className="flex flex-col gap-1">
        {users.slice(0, 5).map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 rounded-2xl px-1 py-2"
          >
            <Link href={profilePath(user.username)} className="shrink-0">
              <UserAvatar
                alt={nameOf(user)}
                avatarUrl={user.avatar_url}
                name={user.username}
                className="size-10"
              />
            </Link>
            <Link href={profilePath(user.username)} className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-foreground">
                {nameOf(user)}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                @{user.username}
              </span>
            </Link>
            <Button
              size="sm"
              variant={user.is_following ? "secondary" : "default"}
              onClick={() => onToggleFollow(user)}
            >
              {user.is_following ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FollowSuggestionsSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Skeleton className="h-3 w-28" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 px-1 py-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}
