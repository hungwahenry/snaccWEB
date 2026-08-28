import { api } from "@/lib/api/client"

export type NotificationTypeRow = {
  key: string
  label: string
  body_template: string
  detail_template: string | null
  icon_name: string
  target_kind: string
  default_push: boolean
  default_email: boolean
  instant_email: boolean
  aggregates: boolean
  group_window_minutes: number | null
  locked: boolean
  emailable: boolean
  push_debounce_seconds: number | null
  position: number
}

export type NotificationTypePatch = Partial<{
  label: string
  bodyTemplate: string
  detailTemplate: string
  defaultPush: boolean
  defaultEmail: boolean
  instantEmail: boolean
  pushDebounceSeconds: number
  groupWindowMinutes: number
  position: number
}>

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
