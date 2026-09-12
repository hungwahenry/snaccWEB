import { UserAvatar } from "@/components/ui/user-avatar"
import { TierName } from "@/features/users/components/flair"
import { ProfileLink } from "@/features/users/components/profile-link"
import type { SnaccResnaccer } from "../../types"
import { nameOf } from "@/features/users/utils/names"

export function ResnaccerRow({ resnaccer }: { resnaccer: SnaccResnaccer }) {
  const { user } = resnaccer

  return (
    <ProfileLink
      username={user.username}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
    >
      <UserAvatar
        alt={nameOf(user)}
        avatarUrl={user.avatar_url}
        name={user.username}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <TierName
            score={user.score}
            official={user.official}
            birthday={user.is_birthday}
            name={nameOf(user)}
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
