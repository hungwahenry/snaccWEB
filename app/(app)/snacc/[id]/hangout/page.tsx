import type { Metadata } from "next"
import { hangoutInfoPath } from "@/features/hangouts/routes"
import { HangoutInfoScreen } from "@/features/hangouts/screens/hangout-info-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Hangout info" }

export default async function HangoutInfoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireSession(hangoutInfoPath(id))
  return <HangoutInfoScreen snaccId={id} />
}
