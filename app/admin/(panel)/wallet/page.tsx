import type { Metadata } from "next"
import { WalletsScreen } from "@/features/admin/wallet/screens/wallets-screen"

export const metadata: Metadata = { title: "Wallets" }

export default function Page() {
  return <WalletsScreen />
}
