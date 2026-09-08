import type { Metadata } from "next"
import { NotificationsScreen } from "@/features/notifications/screens/notifications-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Notifications" }

export default async function NotificationsPage() {
  await requireSession("/notifications")
  return <NotificationsScreen />
}
