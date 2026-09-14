import type { Metadata } from "next"
import { PremiumScreen } from "@/features/admin/premium/screens/premium-screen"

export const metadata: Metadata = { title: "Premium" }

export default function Page() {
  return <PremiumScreen />
}
