import type { Metadata } from "next"
import { RoomsScreen } from "@/features/admin/rooms/screens/rooms-screen"

export const metadata: Metadata = { title: "Rooms" }

export default function Page() {
  return <RoomsScreen />
}
