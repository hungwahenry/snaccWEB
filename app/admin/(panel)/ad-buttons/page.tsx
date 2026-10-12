import type { Metadata } from "next"
import { AdButtonsScreen } from "@/features/admin/ads/screens/ad-buttons-screen"

export const metadata: Metadata = { title: "Ad button labels" }

export default function Page() {
  return <AdButtonsScreen />
}
