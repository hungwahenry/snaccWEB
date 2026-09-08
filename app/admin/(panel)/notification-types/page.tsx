import type { Metadata } from "next"
import { NotificationTypesScreen } from "@/features/admin/notification-types/screens/notification-types-screen"

export const metadata: Metadata = { title: "Notification types" }

export default function Page() {
  return <NotificationTypesScreen />
}
