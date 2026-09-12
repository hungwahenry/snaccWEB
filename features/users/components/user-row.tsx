import { memo, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { Author } from "../types"
import { nameOf } from "../utils/names"
import { TierName } from "./flair"
import { PersonAvatar } from "./person-avatar"
import { ProfileLink } from "./profile-link"

export type RowPerson = Pick<
  Author,
  | "id"
  | "username"
  | "display_name"
  | "avatar_url"
  | "score"
  | "official"
  | "is_birthday"
>

type UserRowProps = {
  user: RowPerson
  trailing?: ReactNode
  className?: string
}

export const UserRow = memo(function UserRow({
  user,
  trailing,
  className,
}: UserRowProps) {
  return (
    <div className={cn("flex items-center gap-3 py-2.5", className)}>
      <ProfileLink username={user.username} className="shrink-0" tabIndex={-1}>
        <PersonAvatar person={user} className="size-10" />
      </ProfileLink>

      <ProfileLink username={user.username} className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <TierName
            score={user.score}
            official={user.official}
            birthday={user.is_birthday}
            name={nameOf(user)}
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
})
