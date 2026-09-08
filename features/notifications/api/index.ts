import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { Notification } from "../types"

export function listNotifications(
  page: number
): Promise<Paginated<Notification>> {
  return api.get<Paginated<Notification>>("/notifications", { page })
}

export async function getUnreadCount(): Promise<number> {
  const result = await api.get<{ count: number }>("/notifications/unread-count")
  return result.count
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.post(`/notifications/${id}/read`)
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post("/notifications/read-all")
}

export async function markNotificationsSeen(): Promise<void> {
  await api.post("/notifications/seen")
}
