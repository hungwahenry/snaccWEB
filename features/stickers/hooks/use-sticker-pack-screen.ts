"use client"

import { useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useIsPremium } from "@/features/premium/hooks/use-premium-limit"
import { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import { useBack } from "@/hooks/use-back"
import { isNotFound } from "@/lib/api/errors"
import { copyLink, shareLink } from "@/lib/share-links"
import { MY_STICKER_PACKS_PATH, STICKERS_PATH } from "../routes"
import type { PackTile } from "../types"
import {
  canEditPack,
  canSavePack,
  packEmpty,
  packMenu,
  packTiles,
} from "../utils/packs"
import { useDeleteStickerPack } from "./use-delete-sticker-pack"
import { useRenameStickerPack } from "./use-pack-title"
import { useSaveStickerPack } from "./use-save-sticker-pack"
import { useStickerCreator } from "./use-sticker-creator"
import { useStickerPack } from "./use-sticker-packs"
import { useTileAction } from "./use-tile-action"

export function useStickerPackScreen(id: string) {
  const enabled = useFlag("stickers")
  const premium = useIsPremium()
  const query = useStickerPack(id, enabled)
  const pack = query.data
  const back = useBack(pack?.mine ? MY_STICKER_PACKS_PATH : STICKERS_PATH)
  const save = useSaveStickerPack()
  const actOn = useTileAction()
  const rename = useRenameStickerPack(pack)
  const remove = useDeleteStickerPack()
  const report = useReportSheet()
  const creator = useStickerCreator()
  const [menuOpen, setMenuOpen] = useState(false)

  const menu = pack ? packMenu(pack) : null
  const editable = pack ? canEditPack(pack) : false

  function closeThen(act: () => void) {
    return () => {
      setMenuOpen(false)
      act()
    }
  }

  return {
    enabled,
    onBack: back,
    pack,
    missing: isNotFound(query.error),
    failed: query.isError,
    retry: () => void query.refetch(),
    tiles: pack ? packTiles(pack, premium) : [],
    empty: pack ? packEmpty(pack) : null,
    takenDown: pack?.status === "taken_down",
    lockedForMe: !!pack?.premium && !premium,
    saving: save.isPending(id),
    onToggleSave:
      pack && canSavePack(pack) ? () => save.toggle(pack) : undefined,
    onAddSticker: editable ? () => creator.begin(id) : undefined,
    onAction: (tile: PackTile) => actOn(id, tile),
    onOpenMenu:
      menu && Object.values(menu).some(Boolean)
        ? () => setMenuOpen(true)
        : undefined,
    menuSheet: menu
      ? {
          open: menuOpen,
          onOpenChange: setMenuOpen,
          menu,
          onShare: closeThen(
            () => void copyLink(shareLink.stickerPack(id), "Pack link")
          ),
          onRename: closeThen(rename.start),
          onReport: closeThen(() => report.open({ type: "sticker_pack", id })),
          onDelete: closeThen(() => remove(id)),
        }
      : null,
    renameSheet: rename.sheet,
    report: report.sheet,
    creator,
  }
}
