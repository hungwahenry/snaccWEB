import type { Metadata } from "next"
import { InsightsScreen } from "@/features/insights/screens/insights-screen"
import { INSIGHTS_PATH } from "@/features/insights/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Insights" }

export default async function Page() {
  await requireSession(INSIGHTS_PATH)
  return <InsightsScreen />
}
