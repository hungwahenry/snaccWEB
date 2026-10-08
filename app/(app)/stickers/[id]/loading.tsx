import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { StickerPackSkeleton } from "@/features/stickers/components/sticker-pack-skeleton"
import { STICKERS_PATH } from "@/features/stickers/routes"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Sticker pack" fallback={STICKERS_PATH} />
      <StickerPackSkeleton />
    </>
  )
}
