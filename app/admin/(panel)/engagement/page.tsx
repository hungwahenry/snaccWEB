import type { Metadata } from "next"
import { EngagementScreen } from "@/features/admin/engagement/screens/engagement-screen"

export const metadata: Metadata = { title: "Engagement" }

export default function Page() {
  return <EngagementScreen />
}
