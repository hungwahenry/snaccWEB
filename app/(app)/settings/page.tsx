import type { Metadata } from "next"
import { SettingsScreen } from "@/features/settings/screens/settings-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Settings" }

export default async function SettingsPage() {
  await requireSession("/settings")
  return <SettingsScreen />
}
