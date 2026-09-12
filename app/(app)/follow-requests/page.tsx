import type { Metadata } from "next"
import { FOLLOW_REQUESTS_PATH } from "@/features/follows/routes"
import { FollowRequestsScreen } from "@/features/follows/screens/follow-requests-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Follow requests" }

export default async function FollowRequestsPage() {
  await requireSession(FOLLOW_REQUESTS_PATH)
  return <FollowRequestsScreen />
}
