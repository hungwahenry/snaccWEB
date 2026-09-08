import type { Metadata } from "next"
import { ScoreScreen } from "@/features/score/screens/score-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Snacc Score" }

export default async function Page() {
  await requireSession("/score")

  return <ScoreScreen />
}
