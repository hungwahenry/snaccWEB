import type { Metadata } from "next"
import { stickerPackPath } from "@/features/stickers/routes"
import { StickerPackScreen } from "@/features/stickers/screens/sticker-pack-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Sticker pack" }

export default async function StickerPackPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireSession(stickerPackPath(id))

  return <StickerPackScreen id={id} />
}
