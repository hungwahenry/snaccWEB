import type { Metadata } from "next"
import { ModerationScreen } from "@/features/admin/moderation/screens/moderation-screen"

export const metadata: Metadata = { title: "Automatic review" }

export default function Page() {
  return <ModerationScreen />
}
