import type { Metadata } from "next"
import { clipsPath } from "@/features/clips/routes"
import { ClipViewerScreen } from "@/features/clips/screens/clip-viewer-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Clips" }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ revealed?: string }>
}

export default async function ClipsPage({ params, searchParams }: Props) {
  const { id } = await params
  const { revealed } = await searchParams
  await requireSession(clipsPath(id))

  return <ClipViewerScreen key={id} startId={id} revealed={revealed === "1"} />
}
