import type { Metadata } from "next"
import { HeldStickersScreen } from "@/features/admin/stickers/screens/held-stickers-screen"

export const metadata: Metadata = { title: "Held stickers" }

export default function Page() {
  return <HeldStickersScreen />
}
