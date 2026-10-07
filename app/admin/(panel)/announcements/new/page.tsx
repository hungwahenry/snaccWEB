import type { Metadata } from "next"
import { NewAnnouncementScreen } from "@/features/admin/announcements/screens/new-announcement-screen"

export const metadata: Metadata = { title: "New announcement" }

export default function Page() {
  return <NewAnnouncementScreen />
}
