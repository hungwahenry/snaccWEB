import type { Metadata } from "next"
import { ScoreScreen } from "@/features/score/screens/score-screen"
import { SCORE_PATH } from "@/features/score/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Snacc Score" }

export default async function Page() {
  await requireSession(SCORE_PATH)

  return <ScoreScreen />
}
