import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { TierName } from "@/features/users/components/flair"
import { profilePath } from "@/features/users/routes"
import type { FollowUser } from "../types"
import { nameOf } from "@/features/users/utils/names"
import { followButtonLabel } from "../utils/follow-state"

type FollowUserRowProps = {
  user: FollowUser
  isMe: boolean
  onToggleFollow: () => void
  onRemove?: () => void
}

export function FollowUserRow({
  user,
  isMe,
  onToggleFollow,
  onRemove,
}: FollowUserRowProps) {
  const href = profilePath(user.username)

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Link href={href} className="shrink-0">
        <UserAvatar
          alt={nameOf(user)}
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
            name={nameOf(user)}
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

      {onRemove ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-muted-foreground"
        >
          Remove
        </Button>
      ) : null}

      {isMe ? null : (
        <Button
          variant={user.follow_state === "none" ? "default" : "outline"}
          size="sm"
          onClick={onToggleFollow}
        >
          {followButtonLabel(user.follow_state, user.follows_you)}
        </Button>
      )}
    </div>
  )
}
