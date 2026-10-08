import type { Metadata } from "next"
import { MY_STICKER_PACKS_PATH } from "@/features/stickers/routes"
import { MyStickerPacksScreen } from "@/features/stickers/screens/my-sticker-packs-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Your packs" }

export default async function MyStickerPacksPage() {
  await requireSession(MY_STICKER_PACKS_PATH)
  return <MyStickerPacksScreen />
}
