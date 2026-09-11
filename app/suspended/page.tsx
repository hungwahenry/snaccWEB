import type { Metadata } from "next"
import { SuspendedScreen } from "@/features/suspensions/screens/suspended-screen"
import { SUSPENDED_PATH } from "@/features/suspensions/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Account suspended" }

export default async function Page() {
  await requireSession(SUSPENDED_PATH)

  return <SuspendedScreen />
}
