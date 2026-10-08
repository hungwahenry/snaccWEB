"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { usePremiumNudge } from "@/features/premium/hooks/use-premium-limit"
import { SETTINGS_PATH } from "@/features/settings/routes"
import { useBack } from "@/hooks/use-back"
import { hubRows } from "../utils/hub"
import { useNewPackField } from "./use-pack-title"
import { useSaveStickerPack } from "./use-save-sticker-pack"
import {
  useMyStickerPacks,
  useStickerCatalog,
  useStickerTrayPacks,
} from "./use-sticker-packs"

export function useStickersScreen() {
  const enabled = useFlag("stickers")
  const back = useBack(SETTINGS_PATH)
  const tray = useStickerTrayPacks(enabled)
  const mine = useMyStickerPacks(enabled)
  const catalog = useStickerCatalog(enabled)
  const save = useSaveStickerPack()
  const newPack = useNewPackField()
  const made = mine.data ?? []

  const full = usePremiumNudge(
    "content.sticker.packs_max",
    (max) => made.length >= max,
    (upgrade) => `${upgrade} packs with Premium`
  )

  return {
    enabled,
    onBack: back,
    rows: hubRows({
      favourites: tray.data?.favourites ?? null,
      mine: made,
      tray: tray.data?.packs ?? [],
      catalog: catalog.packs,
    }),
    loading: tray.isPending || mine.isPending,
    failed: tray.isError || mine.isError,
    retry: () => {
      void tray.refetch()
      void mine.refetch()
    },
    more: catalog.hasMore
      ? { loading: catalog.loadingMore, onReach: catalog.loadMore }
      : null,
    newPack,
    full,
    saving: save.isPending,
    onAction: save.toggle,
  }
}
