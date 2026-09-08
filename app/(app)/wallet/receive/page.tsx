import type { Metadata } from "next"
import { ReceiveScreen } from "@/features/wallet/screens/receive-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Account number" }

export default async function Page() {
  await requireSession("/wallet/receive")

  return <ReceiveScreen />
}
