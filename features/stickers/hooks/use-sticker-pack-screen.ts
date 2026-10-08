"use client"

import { useRouter } from "next/navigation"
import { useFlag } from "@/features/config/hooks/use-flag"
import {
  useIsPremium,
  usePremiumNudge,
} from "@/features/premium/hooks/use-premium-limit"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import { useBack } from "@/hooks/use-back"
import { isNotFound } from "@/lib/api/errors"
import { copyLink, shareLink, shareOrCopy } from "@/lib/share-links"
import { STICKERS_PATH } from "../routes"
import type { MakeMenuId, PackMenuId, StickerTile } from "../types"
import { canAddTo, MAKE_MENU, packDetails, packMenu } from "../utils/packs"
import { packTiles } from "../utils/tiles"
import { useDeleteStickerPack } from "./use-delete-sticker-pack"
import { useGiphyAdder } from "./use-giphy-adder"
import { useRenameField } from "./use-pack-title"
import { useSaveStickerPack } from "./use-save-sticker-pack"
import { useTileActions } from "./use-sticker-actions"
import { useStickerCreator } from "./use-sticker-creator"
import { useStickerPack } from "./use-sticker-packs"

export function useStickerPackScreen(id: string) {
  const router = useRouter()
  const enabled = useFlag("stickers")
  const premium = useIsPremium()
  const query = useStickerPack(id, enabled)
  const pack = query.data ?? null
  const back = useBack(STICKERS_PATH)
  const save = useSaveStickerPack()
  const onTileAction = useTileActions()
  const creator = useStickerCreator()
  const rename = useRenameField(pack)
  const remove = useDeleteStickerPack()
  const report = useReportSheet()
  const favourites = pack?.kind === "favourites"
  const addable = pack !== null && canAddTo(pack)
  const giphy = useGiphyAdder(addable ? pack.id : null)

  const full = usePremiumNudge(
    favourites
      ? "content.sticker.favourites_max"
      : "content.sticker.pack_size_max",
    (max) => (pack?.stickers_count ?? 0) >= max,
    (upgrade) => `${upgrade} stickers with Premium`
  )

  function onMenu(choice: PackMenuId) {
    if (!pack) return
    const link = shareLink.stickerPack(pack.id)
    if (choice === "share") void shareOrCopy(link, pack.title, "Pack link")
    if (choice === "copy") void copyLink(link, "Pack link")
    if (choice === "rename") rename.start()
    if (choice === "delete") remove(pack.id)
    if (choice === "report") report.open({ type: "sticker_pack", id: pack.id })
  }

  return {
    enabled,
    onBack: back,
    pack,
    details: pack ? packDetails(pack) : "",
    renaming: rename.field,
    missing: isNotFound(query.error),
    failed: query.isError,
    retry: () => void query.refetch(),
    tiles: pack ? packTiles(pack, premium) : [],
    locked: pack !== null && pack.premium && !premium,
    menu: pack ? packMenu(pack, true) : [],
    onMenu,
    save:
      pack && pack.kind === "pack" && !pack.mine
        ? {
            saved: pack.saved,
            busy: save.isPending(pack.id),
            onToggle: () => save.toggle(pack),
          }
        : null,
    make: addable
      ? {
          label: favourites ? "Make a sticker" : "Add stickers",
          items: MAKE_MENU,
          onSelect: (choice: MakeMenuId) =>
            choice === "giphy" ? giphy.start() : creator.begin(pack.id),
        }
      : null,
    giphy: giphy.view,
    full: addable ? full : null,
    emptyHint: addable ? "Add one to get it going." : undefined,
    onPick: (tile: StickerTile) => {
      if (tile.state === "locked") router.push(PREMIUM_PATH)
    },
    onAction: onTileAction,
    creator,
    report: report.sheet,
  }
}
