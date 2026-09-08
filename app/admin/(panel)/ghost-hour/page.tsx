import type { Metadata } from "next"
import { GhostHourScreen } from "@/features/admin/ghost-hour/screens/ghost-hour-screen"

export const metadata: Metadata = { title: "Ghost Hour" }

export default function Page() {
  return <GhostHourScreen />
}
