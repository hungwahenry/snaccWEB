import type { Metadata } from "next"
import { PROMOTIONS_PATH } from "@/features/ads/routes"
import { PromotionsScreen } from "@/features/ads/screens/promotions-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Your promotions" }

export default async function Page() {
  await requireSession(PROMOTIONS_PATH)
  return <PromotionsScreen />
}
