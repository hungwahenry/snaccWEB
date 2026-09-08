"use client"

import { CheckCheckIcon, HeartIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { TabHeader } from "@/features/navigation/components/tab-header"
import {
  NotificationRow,
  NotificationRowSkeleton,
} from "../components/notification-row"
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMarkNotificationsSeen,
} from "../hooks/use-mark-read"
import { useNotifications } from "../hooks/use-notifications"
import { useUnreadCount } from "../hooks/use-unread-count"
import { notificationRoute } from "@/features/notifications/utils/notification-display"
import type { Notification } from "../types"

export function NotificationsScreen() {
  const router = useRouter()
  const { notifications, loading, failed, retry, loadMore, loadingMore } =
    useNotifications()
  const { mutate: markSeen } = useMarkNotificationsSeen()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const unread = useUnreadCount().data ?? 0
  const anyUnread = notifications.some((notification) => !notification.read_at)

  useEffect(() => {
    if (unread > 0) markSeen()
  }, [unread, markSeen])

  function onPress(notification: Notification) {
    if (!notification.read_at) markRead.mutate(notification.id)
    const route = notificationRoute(notification)
    if (route) router.push(route)
  }

  return (
    <>
      <TabHeader
        title="Notifications"
        right={
          anyUnread ? (
            <IconButton
              icon={CheckCheckIcon}
              label="Mark all read"
              onClick={() => markAllRead.mutate()}
            />
          ) : null
        }
      />

      {loading ? (
        <SkeletonRows count={8} item={NotificationRowSkeleton} />
      ) : failed && notifications.length === 0 ? (
        <div className="py-24">
          <LoadFailed title="Could not load notifications" onRetry={retry} />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={HeartIcon}
          title="No notifications yet"
          description="When people follow you or react to your snaccs, you'll see it here."
          className="py-24"
        />
      ) : (
        <>
          {notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              actionable={
                Boolean(notificationRoute(notification)) ||
                !notification.read_at
              }
              onPress={onPress}
            />
          ))}
          <LoadMore onReach={loadMore} disabled={loadingMore} />
          <ListFooter loading={loadingMore} />
        </>
      )}
    </>
  )
}
