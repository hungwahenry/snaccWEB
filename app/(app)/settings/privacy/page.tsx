import type { Metadata } from "next"
import { PrivacySettingsScreen } from "@/features/messages/screens/privacy-settings-screen"
import { MESSAGE_PRIVACY_PATH } from "@/features/messages/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Privacy" }

export default async function PrivacySettingsPage() {
  await requireSession(MESSAGE_PRIVACY_PATH)
  return <PrivacySettingsScreen />
}
