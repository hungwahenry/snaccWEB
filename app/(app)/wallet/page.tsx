import type { Metadata } from "next"
import { WalletScreen } from "@/features/wallet/screens/wallet-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Money" }

export default async function Page() {
  await requireSession("/wallet")

  return <WalletScreen />
}
