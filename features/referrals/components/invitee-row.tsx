import { PersonAvatar } from "@/features/users/components/person-avatar"
import { ProfileLink } from "@/features/users/components/profile-link"
import { nameOf } from "@/features/users/utils/names"
import { shortDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Invitee } from "../types"
import { INVITEE_STATUS } from "../utils/invite"

export function InviteeRow({ invitee }: { invitee: Invitee }) {
  const status = INVITEE_STATUS[invitee.status]

  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <ProfileLink username={invitee.user.username} className="shrink-0">
        <PersonAvatar person={invitee.user} className="size-11" />
      </ProfileLink>

      <ProfileLink username={invitee.user.username} className="min-w-0 flex-1">
        <span className="block truncate font-extrabold text-foreground">
          {nameOf(invitee.user)}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          Joined {shortDate(invitee.created_at)}
        </span>
      </ProfileLink>

      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-bold",
          status.className
        )}
      >
        {status.label}
      </span>
    </div>
  )
}

export function InviteeRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <div className="size-11 animate-pulse rounded-full bg-muted" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
    </div>
  )
}
