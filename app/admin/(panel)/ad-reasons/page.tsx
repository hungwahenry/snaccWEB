import type { Metadata } from "next"
import { AdReasonsScreen } from "@/features/admin/ads/screens/ad-reasons-screen"

export const metadata: Metadata = { title: "Ad rejection reasons" }

export default function Page() {
  return <AdReasonsScreen />
}
