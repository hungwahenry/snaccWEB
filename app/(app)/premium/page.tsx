import type { Metadata } from "next"
import { PremiumScreen } from "@/features/premium/screens/premium-screen"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Premium" }

export default async function Page() {
  await requireSession(PREMIUM_PATH)
  return <PremiumScreen />
}
