"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listNotifications } from "../api"

export const NOTIFICATIONS_KEY = ["notifications"]

export function useNotifications() {
  const { items, ...list } = useInfiniteList(
    NOTIFICATIONS_KEY,
    listNotifications
  )
  return { notifications: items, ...list }
}
