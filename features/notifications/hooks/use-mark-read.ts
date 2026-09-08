"use client"

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query"
import type { Paginated } from "@/lib/api/types"
import {
  markAllNotificationsRead,
  markNotificationRead,
  markNotificationsSeen,
} from "../api"
import type { Notification } from "../types"
import { NOTIFICATIONS_KEY } from "./use-notifications"
import { UNREAD_KEY } from "./use-unread-count"

type Pages = InfiniteData<Paginated<Notification>>

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationRead,
    onMutate: (id: string) => {
      const now = new Date().toISOString()
      queryClient.setQueryData<Pages>(NOTIFICATIONS_KEY, (data) =>
        data
          ? {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                items: page.items.map((n) =>
                  n.id === id && !n.read_at ? { ...n, read_at: now } : n
                ),
              })),
            }
          : data
      )
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: () => {
      const now = new Date().toISOString()
      queryClient.setQueryData<Pages>(NOTIFICATIONS_KEY, (data) =>
        data
          ? {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                items: page.items.map((n) => ({
                  ...n,
                  read_at: n.read_at ?? now,
                  seen_at: n.seen_at ?? now,
                })),
              })),
            }
          : data
      )
      queryClient.setQueryData(UNREAD_KEY, 0)
    },
  })
}

export function useMarkNotificationsSeen() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationsSeen,
    onSuccess: () => queryClient.setQueryData(UNREAD_KEY, 0),
  })
}
