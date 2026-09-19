import type { Metadata } from "next"
import { EggsScreen } from "@/features/eggs/screens/eggs-screen"
import { EGGS_PATH } from "@/features/eggs/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Easter eggs" }

export default async function Page() {
  await requireSession(EGGS_PATH)
  return <EggsScreen />
}
