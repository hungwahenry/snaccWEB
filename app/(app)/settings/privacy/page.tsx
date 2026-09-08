import type { Metadata } from "next"
import { PrivacySettingsScreen } from "@/features/messages/screens/privacy-settings-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Privacy" }

export default async function PrivacySettingsPage() {
  await requireSession("/settings/privacy")
  return <PrivacySettingsScreen />
}
