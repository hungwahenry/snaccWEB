import type { Metadata } from "next"
import { AboutScreen } from "@/features/settings/screens/about-screen"
import { ABOUT_PATH } from "@/features/settings/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "About" }

export default async function Page() {
  await requireSession(ABOUT_PATH)

  return <AboutScreen />
}
