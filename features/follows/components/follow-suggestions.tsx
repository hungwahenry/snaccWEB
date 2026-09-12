import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { UserAvatar } from "@/components/ui/user-avatar"
import { profilePath } from "@/features/users/routes"
import type { FollowUser } from "../types"
import { nameOf } from "@/features/users/utils/names"
import { followButtonLabel } from "../utils/follow-state"

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
              variant={user.follow_state === "none" ? "default" : "secondary"}
              onClick={() => onToggleFollow(user)}
            >
              {followButtonLabel(user.follow_state, user.follows_you)}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
