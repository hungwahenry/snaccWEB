import type { Metadata } from "next"
import { ScoreTiersScreen } from "@/features/admin/score-tiers/screens/score-tiers-screen"

export const metadata: Metadata = { title: "Score tiers" }

export default function Page() {
  return <ScoreTiersScreen />
}
