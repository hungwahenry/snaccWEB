"use client"

import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useGiphyFeed } from "@/features/giphy/hooks/use-giphy-feed"
import type { Gif } from "@/features/giphy/types"
import { useIsPremium } from "@/features/premium/hooks/use-premium-limit"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { showNotice } from "@/lib/feedback"
import { STICKERS_PATH } from "../routes"
import type {
  PackPanelState,
  PackShelfState,
  PackTile,
  StickerPick,
  TrayGridState,
  TrayTab,
} from "../types"
import {
  canEditPack,
  packByline,
  packEmpty,
  packTiles,
  shelfPacks,
  shownPackId,
  trayPack,
} from "../utils/packs"
import { pickOfGiphy, pickOfSticker } from "../utils/pick"
import {
  giphyEmpty,
  shownTab,
  trayItemLabel,
  traySearchPlaceholder,
  trayTabs,
  trayTitle,
} from "../utils/tray"
import { useKeepSticker } from "./use-keep-sticker"
import { useStickerCreator } from "./use-sticker-creator"
import { useStickerPack, useStickerTrayPacks } from "./use-sticker-packs"
import { useTileAction } from "./use-tile-action"

export interface StickerTrayOptions {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPickSticker?: (pick: StickerPick) => void
  onPickGif?: (gif: Gif) => void
  beforeLeaving?: (leave: () => void) => void
}

export function useStickerTray({
  open,
  onOpenChange,
  onPickSticker,
  onPickGif,
  beforeLeaving,
}: StickerTrayOptions) {
  const router = useRouter()
  const premium = useIsPremium()
  const stickersOn = useFlag("stickers") && !!onPickSticker
  const gifsOn = useFlag("giphy") && !!onPickGif
  const tabs = useMemo(
    () => trayTabs({ stickers: stickersOn, gifs: gifsOn }),
    [stickersOn, gifsOn]
  )
  const [pickedTab, setPickedTab] = useState<TrayTab | null>(null)
  const [pickedPack, setPickedPack] = useState<string | null>(null)
  const tab = shownTab(tabs, pickedTab)
  const onPacks = tab === "stickers"

  const [query, setQuery] = useState("")
  const debounced = useDebouncedValue(query, 300)

  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (!open) setQuery("")
  }

  const tray = useStickerTrayPacks(open && onPacks)
  const packId = shownPackId(tray.data, pickedPack)
  const summary = trayPack(tray.data, packId)
  const pack = useStickerPack(packId, open && onPacks)
  const feed = useGiphyFeed(
    tab === "gifs" ? "gifs" : "stickers",
    debounced,
    open && !onPacks
  )
  const keep = useKeepSticker()
  const actOn = useTileAction()
  const creator = useStickerCreator((sticker) =>
    onPickSticker?.(pickOfSticker(sticker))
  )

  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  function leaveFor(path: string) {
    close()
    const leave = () => router.push(path)
    if (beforeLeaving) beforeLeaving(leave)
    else leave()
  }

  function pickTab(next: TrayTab) {
    setPickedTab(next)
    setQuery("")
  }

  function pickTile(tile: PackTile) {
    if (tile.state === "held") {
      showNotice(
        "This sticker is still being checked. You can send it once it clears."
      )
      return
    }
    if (tile.state === "locked") {
      leaveFor(PREMIUM_PATH)
      return
    }
    close()
    onPickSticker?.(pickOfSticker(tile.sticker))
  }

  function pickGiphy(id: string) {
    const gif = feed.items.find((item) => item.id === id)
    if (!gif) return
    close()
    if (tab === "gifs") onPickGif?.(gif)
    else onPickSticker?.(pickOfGiphy(gif))
  }

  const shelf: PackShelfState | null = onPacks
    ? {
        packs: tray.data ? shelfPacks(tray.data) : [],
        selectedId: packId,
        loading: tray.isPending,
        failed: tray.isError,
        onRetry: () => void tray.refetch(),
        onSelect: setPickedPack,
        onBrowse: () => leaveFor(STICKERS_PATH),
      }
    : null

  const panel: PackPanelState | null =
    onPacks && summary
      ? {
          title: summary.title,
          byline: packByline(summary),
          tiles: pack.data ? packTiles(pack.data, premium) : [],
          loading: pack.isPending,
          failed: pack.isError,
          empty: packEmpty(summary),
          onRetry: () => void pack.refetch(),
          onCreate: canEditPack(summary)
            ? () => {
                close()
                creator.begin(summary.id)
              }
            : undefined,
          onPick: pickTile,
          onAction: (tile) => actOn(summary.id, tile),
        }
      : null

  const grid: TrayGridState | null = onPacks
    ? null
    : {
        items: feed.items,
        itemLabel: trayItemLabel(tab),
        loading: feed.loading,
        failed: feed.failed,
        empty: giphyEmpty(tab, feed.searching),
        onRetry: feed.retry,
        onPick: pickGiphy,
        onKeep:
          tab === "giphy" && keep ? (id) => keep({ giphyId: id }) : undefined,
      }

  const placeholder = traySearchPlaceholder(tab)

  return {
    title: trayTitle(tabs),
    tabs,
    tab,
    onTabChange: pickTab,
    shelf,
    panel,
    search: placeholder
      ? { query, onQueryChange: setQuery, placeholder }
      : null,
    grid,
    showAttribution: !onPacks,
    creator,
  }
}
