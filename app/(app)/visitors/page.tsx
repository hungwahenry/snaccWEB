import type { Metadata } from "next"
import { VisitorsScreen } from "@/features/profile-views/screens/visitors-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Visitors" }

export default async function Page() {
  await requireSession("/visitors")

  return <VisitorsScreen />
}
