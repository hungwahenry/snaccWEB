import type { Metadata } from "next"
import { AdsScreen } from "@/features/admin/ads/screens/ads-screen"

export const metadata: Metadata = { title: "Promotions" }

export default function Page() {
  return <AdsScreen />
}
