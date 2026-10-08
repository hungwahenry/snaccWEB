"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { STICKER_PACKS_PATH } from "@/features/admin/shell/routes"
import { StickerPackDetail } from "../components/sticker-pack-detail"
import { useStickerPackScreen } from "../hooks/use-sticker-pack-screen"

export function StickerPackScreen({ id }: { id: string }) {
  const editor = useStickerPackScreen(id)

  return (
    <>
      <BackLink href={STICKER_PACKS_PATH} label="Back to sticker packs" />
      <QueryView query={editor.query} what="this sticker pack">
        {(pack) => <StickerPackDetail pack={pack} editor={editor} />}
      </QueryView>
    </>
  )
}
