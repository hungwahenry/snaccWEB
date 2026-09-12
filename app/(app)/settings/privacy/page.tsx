import type { Metadata } from "next"
import { PRIVACY_SETTINGS_PATH } from "@/features/settings/routes"
import { PrivacySettingsScreen } from "@/features/settings/screens/privacy-settings-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Privacy" }

export default async function PrivacySettingsPage() {
  await requireSession(PRIVACY_SETTINGS_PATH)
  return <PrivacySettingsScreen />
}
