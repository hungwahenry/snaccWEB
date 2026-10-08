import type { Metadata } from "next"
import { StickerPacksScreen } from "@/features/admin/stickers/screens/sticker-packs-screen"

export const metadata: Metadata = { title: "Sticker packs" }

export default function Page() {
  return <StickerPacksScreen />
}
