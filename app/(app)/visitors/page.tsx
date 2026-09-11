import type { Metadata } from "next"
import { VisitorsScreen } from "@/features/profile-views/screens/visitors-screen"
import { VISITORS_PATH } from "@/features/profile-views/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Visitors" }

export default async function Page() {
  await requireSession(VISITORS_PATH)

  return <VisitorsScreen />
}
