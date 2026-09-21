import type { Metadata } from "next"
import { HANGOUTS_PATH } from "@/features/hangouts/routes"
import { HangoutsScreen } from "@/features/hangouts/screens/hangouts-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Hangouts" }

export default async function HangoutsPage() {
  await requireSession(HANGOUTS_PATH)
  return <HangoutsScreen />
}
