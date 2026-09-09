import type { Metadata } from "next"
import { InsightsScreen } from "@/features/insights/screens/insights-screen"

export const metadata: Metadata = { title: "Insights" }

export default function Page() {
  return <InsightsScreen />
}
