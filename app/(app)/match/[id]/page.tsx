import type { Metadata } from "next"
import { matchRoomPath } from "@/features/football/routes"
import { MatchRoomScreen } from "@/features/football/screens/match-room-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Match" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireSession(matchRoomPath(id))

  return <MatchRoomScreen matchId={id} />
}
