import type { Metadata } from "next"
import { MoneySettingsScreen } from "@/features/wallet/screens/money-settings-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Money settings" }

export default async function Page() {
  await requireSession("/wallet/settings")

  return <MoneySettingsScreen />
}
