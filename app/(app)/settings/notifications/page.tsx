import type { Metadata } from "next"
import { NotificationSettingsScreen } from "@/features/notifications/screens/notification-settings-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Notifications" }

export default async function Page() {
  await requireSession("/settings/notifications")

  return <NotificationSettingsScreen />
}
