import type { Metadata } from "next"
import { SuspendedScreen } from "@/features/suspensions/screens/suspended-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Account suspended" }

export default async function Page() {
  await requireSession("/suspended")

  return <SuspendedScreen />
}
