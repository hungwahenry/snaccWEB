"use client"

import { useCallback, useMemo, useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useGiphyFeed } from "@/features/giphy/hooks/use-giphy-feed"
import type { Gif } from "@/features/giphy/types"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { Sticker, TrayGridState, TrayTab } from "../types"
import {
  shownTab,
  trayEmpty,
  trayItemLabel,
  traySearchPlaceholder,
  trayTabs,
  trayTitle,
} from "../utils/tray"
import { useKeepGiphySticker } from "./use-keep-sticker"
import { useRemoveSticker } from "./use-remove-sticker"
import { useSendGiphySticker } from "./use-send-giphy-sticker"
import { useStickerLibrary } from "./use-sticker-library"

export interface StickerTrayOptions {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPickSticker?: (sticker: Sticker) => void
  onPickGif?: (gif: Gif) => void
}

export function useStickerTray({
  open,
  onOpenChange,
  onPickSticker,
  onPickGif,
}: StickerTrayOptions) {
  const stickersOn = useFlag("stickers") && !!onPickSticker
  const gifsOn = useFlag("giphy") && !!onPickGif
  const tabs = useMemo(
    () => trayTabs({ stickers: stickersOn, gifs: gifsOn }),
    [stickersOn, gifsOn]
  )
  const [picked, setPicked] = useState<TrayTab | null>(null)
  const tab = shownTab(tabs, picked)

  const [query, setQuery] = useState("")
  const debounced = useDebouncedValue(query, 300)
  const mine = tab === "mine"

  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (!open) setQuery("")
  }

  const feed = useGiphyFeed(
    tab === "gifs" ? "gifs" : "stickers",
    debounced,
    open && !mine
  )
  const library = useStickerLibrary(open && mine)
  const keepGiphy = useKeepGiphySticker()
  const remove = useRemoveSticker()
  const sendGiphy = useSendGiphySticker(onPickSticker)

  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  const pickTab = useCallback((next: TrayTab) => {
    setPicked(next)
    setQuery("")
  }, [])

  const onPick = useCallback(
    (id: string) => {
      if (tab === "stickers") {
        close()
        sendGiphy(id)
        return
      }
      if (tab === "gifs") {
        const gif = feed.items.find((item) => item.id === id)
        if (!gif) return
        close()
        onPickGif?.(gif)
        return
      }
      const sticker = library.stickers.find((item) => item.id === id)
      if (!sticker) return
      close()
      onPickSticker?.(sticker)
    },
    [
      tab,
      feed.items,
      library.stickers,
      close,
      sendGiphy,
      onPickGif,
      onPickSticker,
    ]
  )

  const onHold =
    tab === "stickers" ? keepGiphy : tab === "mine" ? remove : undefined

  const grid: TrayGridState = mine
    ? {
        items: library.stickers,
        itemLabel: trayItemLabel(tab),
        loading: library.loading,
        loadingMore: library.loadingMore,
        failed: library.failed,
        empty: trayEmpty(tab, false),
        onRetry: library.retry,
        onPick,
        onHold,
        onEndReached: library.hasMore ? library.loadMore : undefined,
      }
    : {
        items: feed.items,
        itemLabel: trayItemLabel(tab),
        loading: feed.loading,
        loadingMore: false,
        failed: feed.failed,
        empty: trayEmpty(tab, feed.searching),
        onRetry: feed.retry,
        onPick,
        onHold,
      }

  return {
    title: trayTitle(tabs),
    tabs,
    tab,
    onTabChange: pickTab,
    query,
    onQueryChange: setQuery,
    searchPlaceholder: traySearchPlaceholder(tab),
    showAttribution: !mine,
    grid,
  }
}
