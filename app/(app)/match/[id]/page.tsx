import type { Metadata } from "next"
import { MatchRoomScreen } from "@/features/football/screens/match-room-screen"

export const metadata: Metadata = { title: "Match" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <MatchRoomScreen matchId={id} />
}
