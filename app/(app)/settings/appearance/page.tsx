import type { Metadata } from "next"
import { AppearanceScreen } from "@/features/appearance/screens/appearance-screen"
import { APPEARANCE_PATH } from "@/features/appearance/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Appearance" }

export default async function Page() {
  await requireSession(APPEARANCE_PATH)

  return <AppearanceScreen />
}
