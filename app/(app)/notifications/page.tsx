import type { Metadata } from "next"
import { NotificationsScreen } from "@/features/notifications/screens/notifications-screen"
import { NOTIFICATIONS_PATH } from "@/features/notifications/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Notifications" }

export default async function NotificationsPage() {
  await requireSession(NOTIFICATIONS_PATH)
  return <NotificationsScreen />
}
