import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { handleOf } from "@/lib/format"
import { cn } from "@/lib/utils"

export interface InlineUser {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
}

const SIZES = {
  sm: { avatar: "size-5", initial: "text-[10px]" },
  default: { avatar: "size-8", initial: "text-xs" },
} as const

export function UserInline({
  user,
  note,
  size = "default",
  className,
}: {
  user: InlineUser
  note?: string
  size?: keyof typeof SIZES
  className?: string
}) {
  const sizing = SIZES[size]

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <Avatar className={sizing.avatar}>
        <AvatarImage src={user.avatar_url} alt="" />
        <AvatarFallback className={sizing.initial}>
          {(user.username ?? user.display_name ?? "?").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <Link
          href={`/admin/users/${user.id}`}
          className="block truncate text-sm font-medium underline-offset-4 hover:underline"
        >
          {handleOf(user)}
        </Link>
        {note ? (
          <p className="truncate text-xs text-muted-foreground">{note}</p>
        ) : null}
      </div>
    </div>
  )
}
