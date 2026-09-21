import type { Metadata } from "next"
import { hangoutMembersPath } from "@/features/hangouts/routes"
import { HangoutMembersScreen } from "@/features/hangouts/screens/hangout-members-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Going" }

export default async function HangoutMembersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireSession(hangoutMembersPath(id))
  return <HangoutMembersScreen snaccId={id} />
}
