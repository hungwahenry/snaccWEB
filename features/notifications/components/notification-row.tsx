import { createElement } from "react"
import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/ui/user-avatar"
import { timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"
import { notificationIcon } from "@/features/notifications/utils/notification-display"
import type { Notification } from "../types"

type NotificationRowProps = {
  notification: Notification
  actionable: boolean
  onPress: (notification: Notification) => void
}

export function NotificationRow({
  notification,
  actionable,
  onPress,
}: NotificationRowProps) {
  return (
    <button
      type="button"
      disabled={!actionable}
      onClick={() => onPress(notification)}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3.5 text-left",
        actionable && "transition-colors hover:bg-accent/40 active:opacity-70"
      )}
    >
      <Face notification={notification} />

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[15px] leading-5 text-foreground">
          {notification.body}
        </span>
        {notification.detail ? (
          <span className="line-clamp-2 text-sm text-muted-foreground">
            {notification.detail}
          </span>
        ) : null}
        <span className="text-xs text-muted-foreground">
          {timeAgo(notification.created_at)}
        </span>
      </span>

      {notification.read_at ? null : (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  )
}

function Face({ notification }: { notification: Notification }) {
  if (notification.anonymous) return <GhostAvatar />

  if (!notification.uses_icon && notification.actor) {
    return (
      <UserAvatar
        alt={notification.actor.display_name ?? "Avatar"}
        avatarUrl={notification.actor.avatar_url}
        name={notification.actor.username}
      />
    )
  }

  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-input">
      {createElement(notificationIcon(notification), {
        className: "size-5 text-foreground",
      })}
    </span>
  )
}

export function NotificationRowSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <Skeleton className="size-11 rounded-full" />
      <div className="flex flex-1 flex-col gap-2 pt-1">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}
