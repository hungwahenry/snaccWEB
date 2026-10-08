import type { Metadata } from "next"
import { StickerPackScreen } from "@/features/admin/stickers/screens/sticker-pack-screen"

export const metadata: Metadata = { title: "Sticker pack" }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StickerPackScreen id={id} />
}
