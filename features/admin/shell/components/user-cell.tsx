import Link from "next/link"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { UserRef } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import { userPath } from "../routes"
import { userHandle, userInitialSource, userName } from "../utils/user"

const SIZES = {
  sm: { avatar: "size-5", text: "text-[10px]" },
  default: { avatar: "size-8", text: "text-xs" },
} as const

/**
 * A person in a table or a card: avatar, name and handle. Links to their admin profile unless
 * `linked` is off, e.g. inside a row that is itself a link.
 */
export function UserCell({
  user,
  note,
  size = "default",
  linked = true,
  className,
}: {
  user: UserRef | null
  note?: string
  size?: keyof typeof SIZES
  linked?: boolean
  className?: string
}) {
  if (!user) return <span className="text-sm text-muted-foreground">—</span>

  const sizing = SIZES[size]
  const name = userName(user)
  const handle = userHandle(user)
  const label = size === "sm" ? handle : name

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <UserAvatar
        avatarUrl={user.avatar_url}
        name={userInitialSource(user)}
        alt=""
        className={sizing.avatar}
        textClassName={sizing.text}
      />
      <div className="min-w-0">
        {linked ? (
          <Link
            href={userPath(user.id)}
            className="block truncate text-sm font-medium underline-offset-4 hover:underline"
          >
            {label}
          </Link>
        ) : (
          <p className="truncate text-sm font-medium">{label}</p>
        )}
        {size === "default" ? (
          <p className="truncate text-xs text-muted-foreground">
            {note ?? handle}
          </p>
        ) : null}
      </div>
    </div>
  )
}
