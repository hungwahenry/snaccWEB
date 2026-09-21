import type { Metadata } from "next"
import { editHangoutPath } from "@/features/hangouts/routes"
import { EditHangoutScreen } from "@/features/hangouts/screens/edit-hangout-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Edit hangout" }

export default async function EditHangoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireSession(editHangoutPath(id))
  return <EditHangoutScreen snaccId={id} />
}
