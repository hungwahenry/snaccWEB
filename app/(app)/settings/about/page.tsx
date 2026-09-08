import type { Metadata } from "next"
import { AboutScreen } from "@/features/settings/screens/about-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "About" }

export default async function Page() {
  await requireSession("/settings/about")

  return <AboutScreen />
}
