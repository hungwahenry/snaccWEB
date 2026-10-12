import type { Metadata } from "next"
import { AdPricesScreen } from "@/features/admin/ads/screens/ad-prices-screen"

export const metadata: Metadata = { title: "Ad prices" }

export default function Page() {
  return <AdPricesScreen />
}
