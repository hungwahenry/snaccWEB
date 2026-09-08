import type { Metadata } from "next"
import { MutedScreen } from "@/features/wallet/screens/muted-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Muted requesters" }

export default async function Page() {
  await requireSession("/wallet/muted")

  return <MutedScreen />
}
