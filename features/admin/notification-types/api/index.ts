import type { NotificationTypePatch, NotificationTypeRow } from "../types"
import { api } from "@/lib/api/client"

export function listNotificationTypes() {
  return api.get<NotificationTypeRow[]>("/admin/notification-types")
}

export function updateNotificationType(
  key: string,
  patch: NotificationTypePatch
) {
  return api.patch<NotificationTypeRow>(
    `/admin/notification-types/${key}`,
    patch
  )
}
