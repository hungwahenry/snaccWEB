import type { Metadata } from "next"
import { WaitingScreen } from "@/features/availability/screens/waiting-screen"
import { WAITING_PATH } from "@/features/availability/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "You're on the list" }

export default async function Page() {
  await requireSession(WAITING_PATH)

  return <WaitingScreen />
}
