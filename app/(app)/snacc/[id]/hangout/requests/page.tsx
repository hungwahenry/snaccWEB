import type { Metadata } from "next"
import { hangoutRequestsPath } from "@/features/hangouts/routes"
import { HangoutRequestsScreen } from "@/features/hangouts/screens/hangout-requests-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Requests" }

export default async function HangoutRequestsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireSession(hangoutRequestsPath(id))
  return <HangoutRequestsScreen snaccId={id} />
}
