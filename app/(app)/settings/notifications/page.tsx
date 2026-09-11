import type { Metadata } from "next"
import { NotificationSettingsScreen } from "@/features/notifications/screens/notification-settings-screen"
import { NOTIFICATION_SETTINGS_PATH } from "@/features/notifications/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Notifications" }

export default async function Page() {
  await requireSession(NOTIFICATION_SETTINGS_PATH)

  return <NotificationSettingsScreen />
}
