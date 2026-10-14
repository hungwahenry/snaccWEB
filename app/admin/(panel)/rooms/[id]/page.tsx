import type { Metadata } from "next"
import { RoomScreen } from "@/features/admin/rooms/screens/room-screen"

export const metadata: Metadata = { title: "Room" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <RoomScreen id={id} />
}
