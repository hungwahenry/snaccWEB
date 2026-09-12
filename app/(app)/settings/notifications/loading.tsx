import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { NotificationSettingsSkeleton } from "@/features/notifications/components/notification-settings-skeleton"
import { SETTINGS_PATH } from "@/features/settings/routes"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Notifications" fallback={SETTINGS_PATH} />
      <NotificationSettingsSkeleton />
    </>
  )
}
