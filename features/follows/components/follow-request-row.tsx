import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { TierName } from "@/features/users/components/flair"
import { profilePath } from "@/features/users/routes"
import { nameOf } from "@/features/users/utils/names"
import { handleWithCampus } from "@/features/users/utils/profile"
import type { FollowUser } from "../types"

export function FollowRequestRow({
  user,
  onAccept,
  onDecline,
}: {
  user: FollowUser
  onAccept: (user: FollowUser) => void
  onDecline: (user: FollowUser) => void
}) {
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
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {handleWithCampus(user)}
        </span>
      </Link>

      <div className="flex shrink-0 gap-2">
        <Button variant="outline" size="sm" onClick={() => onDecline(user)}>
          Decline
        </Button>
        <Button size="sm" onClick={() => onAccept(user)}>
          Accept
        </Button>
      </div>
    </div>
  )
}
