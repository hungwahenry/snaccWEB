import type { Metadata } from "next"
import { PinScreen } from "@/features/wallet/screens/pin-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Wallet PIN" }

export default async function Page() {
  await requireSession("/wallet/pin")

  return <PinScreen />
}
