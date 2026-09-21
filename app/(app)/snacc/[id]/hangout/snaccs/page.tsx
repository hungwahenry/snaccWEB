import type { Metadata } from "next"
import { hangoutSnaccsPath } from "@/features/hangouts/routes"
import { HangoutSnaccsScreen } from "@/features/hangouts/screens/hangout-snaccs-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Snaccs from a hangout" }

export default async function HangoutSnaccsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireSession(hangoutSnaccsPath(id))
  return <HangoutSnaccsScreen snaccId={id} />
}
