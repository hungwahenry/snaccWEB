"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { STICKER_PACKS_PATH } from "@/features/admin/shell/routes"
import { splitStickers } from "../utils/packs"
import { useStickerModerationActions } from "./use-sticker-moderation"
import { useStickerPack, useStickerPackActions } from "./use-sticker-packs"
import { useStickerUploads } from "./use-sticker-uploads"

export function useStickerPackScreen(id: string) {
  const router = useRouter()
  const query = useStickerPack(id)
  const actions = useStickerPackActions()
  const moderation = useStickerModerationActions()
  const uploads = useStickerUploads(id)

  const stickers = query.data?.stickers
  const groups = useMemo(() => splitStickers(stickers ?? []), [stickers])

  return {
    query,
    groups,
    uploads,
    rename: (title: string) => actions.update(id, { title }),
    setPremium: (premium: boolean) => actions.update(id, { premium }),
    publish: () => actions.publish(id),
    unpublish: () => actions.unpublish(id),
    setDefault: (on: boolean) => actions.setDefault(id, on),
    setFeatured: (on: boolean) => actions.setFeatured(id, on),
    takeDown: (note?: string) => moderation.takeDown(id, note),
    removeSticker: (stickerId: string) => actions.removeSticker(id, stickerId),
    remove: async () => {
      await actions.remove(id)
      router.replace(STICKER_PACKS_PATH)
    },
  }
}

export type StickerPackEditor = ReturnType<typeof useStickerPackScreen>
