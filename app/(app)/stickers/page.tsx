import type { Metadata } from "next"
import { STICKERS_PATH } from "@/features/stickers/routes"
import { StickerCatalogScreen } from "@/features/stickers/screens/sticker-catalog-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Sticker packs" }

export default async function StickerCatalogPage() {
  await requireSession(STICKERS_PATH)
  return <StickerCatalogScreen />
}
