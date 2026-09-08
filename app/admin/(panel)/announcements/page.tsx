import type { Metadata } from "next"
import { AnnouncementsScreen } from "@/features/admin/announcements/screens/announcements-screen"

export const metadata: Metadata = { title: "Announcements" }

export default function Page() {
  return <AnnouncementsScreen />
}
