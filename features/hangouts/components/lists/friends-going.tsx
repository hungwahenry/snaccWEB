import { UserAvatar } from "@/components/ui/user-avatar"
import type { Author } from "@/features/users/types"
import { nameOf } from "@/features/users/utils/names"
import { friendsGoingLine } from "../../utils/friends-going"

export function FriendsGoing({
  friends,
  count,
}: {
  friends: Author[]
  count: number
}) {
  const line = friendsGoingLine(friends, count)
  if (!line) return null

  return (
    <span className="flex items-center gap-2">
      <span className="flex">
        {friends.map((friend, index) => (
          <span key={friend.id} className={index > 0 ? "-ml-2" : undefined}>
            <UserAvatar
              alt={nameOf(friend)}
              avatarUrl={friend.avatar_url}
              name={friend.username}
              className="size-6 border-2 border-background"
            />
          </span>
        ))}
      </span>
      <span className="line-clamp-2 text-sm text-muted-foreground">{line}</span>
    </span>
  )
}
