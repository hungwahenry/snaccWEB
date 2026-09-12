"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useFollowRequestsCount } from "@/features/follows/hooks/use-follow-requests-count"
import { FOLLOW_REQUESTS_PATH } from "@/features/follows/routes"
import type { Notification } from "../types"
import { notificationRoute } from "../utils/notification-display"
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMarkNotificationsSeen,
} from "./use-mark-read"
import { useNotifications } from "./use-notifications"
import { useUnreadCount } from "./use-unread-count"

export function useNotificationsScreen() {
  const router = useRouter()
  const list = useNotifications()
  const { mutate: markSeen } = useMarkNotificationsSeen()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const unread = useUnreadCount().data ?? 0
  const requests = useFollowRequestsCount()

  useEffect(() => {
    if (unread > 0) markSeen()
  }, [unread, markSeen])

  function onPress(notification: Notification) {
    if (!notification.read_at) markRead.mutate(notification.id)
    if (notification.type === "follow_request" && requests > 0) {
      router.push(FOLLOW_REQUESTS_PATH)
      return
    }
    const route = notificationRoute(notification)
    if (route) router.push(route)
  }

  return {
    list,
    anyUnread: list.notifications.some((notification) => !notification.read_at),
    markAllRead: () => markAllRead.mutate(),
    onPress,
    requests: { count: requests, href: FOLLOW_REQUESTS_PATH },
  }
}
