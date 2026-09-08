import type { Metadata } from "next"
import { AppearanceScreen } from "@/features/appearance/screens/appearance-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Appearance" }

export default async function Page() {
  await requireSession("/settings/appearance")

  return <AppearanceScreen />
}
