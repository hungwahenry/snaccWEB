import type { Metadata } from "next"
import { MomentScreen } from "@/features/moments/screens/moment-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Moments" }

type Props = { params: Promise<{ authorId: string }> }

export default async function MomentPage({ params }: Props) {
  const { authorId } = await params
  await requireSession(`/moments/${authorId}`)

  return <MomentScreen key={authorId} authorId={authorId} />
}
