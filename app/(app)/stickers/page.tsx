import type { Metadata } from "next"
import { STICKERS_PATH } from "@/features/stickers/routes"
import { StickersScreen } from "@/features/stickers/screens/stickers-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Stickers" }

export default async function StickersPage() {
  await requireSession(STICKERS_PATH)
  return <StickersScreen />
}
