"use client"

import { CheckCheckIcon, HeartIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { FollowRequestsRow } from "@/features/follows/components/follow-requests-row"
import { TabHeader } from "@/features/navigation/components/tab-header"
import {
  NotificationRow,
  NotificationRowSkeleton,
} from "../components/notification-row"
import { useNotificationsScreen } from "../hooks/use-notifications-screen"
import { notificationRoute } from "../utils/notification-display"

export function NotificationsScreen() {
  const { list, anyUnread, markAllRead, onPress, requests } =
    useNotificationsScreen()
  const { notifications, loading, failed, retry, loadMore, loadingMore } = list

  return (
    <>
      <TabHeader
        title="Notifications"
        right={
          anyUnread ? (
            <IconButton
              icon={CheckCheckIcon}
              label="Mark all read"
              onClick={markAllRead}
            />
          ) : null
        }
      />

      {requests.count > 0 ? (
        <FollowRequestsRow count={requests.count} href={requests.href} />
      ) : null}

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
