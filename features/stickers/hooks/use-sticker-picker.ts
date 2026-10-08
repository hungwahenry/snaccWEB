"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useGiphyFeed } from "@/features/giphy/hooks/use-giphy-feed"
import type { Gif } from "@/features/giphy/types"
import { useIsPremium } from "@/features/premium/hooks/use-premium-limit"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { showNotice } from "@/lib/feedback"
import type {
  PickerJump,
  PickerTab,
  StickerPack,
  StickerPick,
  StickerTile,
} from "../types"
import { pickOfGiphy, pickOfSticker } from "../utils/pick"
import {
  giphyRows,
  jumpSelector,
  packViewRows,
  pickerJumps,
  pickerRows,
  trayPacks,
} from "../utils/picker"
import { useKeepSticker } from "./use-keep-sticker"
import { useSaveStickerPack } from "./use-save-sticker-pack"
import { useTileActions } from "./use-sticker-actions"
import { useStickerCreator } from "./use-sticker-creator"
import {
  useStickerCatalog,
  useStickerPack,
  useStickerTrayPacks,
} from "./use-sticker-packs"

export interface StickerPickerOptions {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPickSticker?: (pick: StickerPick) => void
  onPickGif?: (gif: Gif) => void
  beforeLeaving?: (leave: () => void) => void
}

export function useStickerPicker({
  open,
  onOpenChange,
  onPickSticker,
  onPickGif,
  beforeLeaving,
}: StickerPickerOptions) {
  const router = useRouter()
  const premium = useIsPremium()
  const stickers = useFlag("stickers") && onPickSticker !== undefined
  const gifs = useFlag("giphy") && onPickGif !== undefined
  const [chosen, setChosen] = useState<PickerTab>("stickers")
  const tab: PickerTab = !gifs ? "stickers" : !stickers ? "gifs" : chosen
  const [query, setQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [viewing, setViewing] = useState<string | null>(null)
  const [current, setCurrent] = useState<string | null>(null)
  const term = useDebouncedValue(query, 300).trim()
  const listRef = useRef<HTMLDivElement>(null)
  const returnTo = useRef(0)

  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (!open) {
      setQuery("")
      setSearching(false)
      setViewing(null)
    }
  }

  const browsing = open && stickers
  const tray = useStickerTrayPacks(browsing)
  const catalog = useStickerCatalog(browsing)
  const packs = trayPacks(tray.data)
  const fromTray = packs.find((pack) => pack.id === viewing)
  const fetched = useStickerPack(
    viewing && !fromTray ? viewing : null,
    browsing
  )
  const viewed = fromTray ?? fetched.data ?? null
  const view = term || searching ? "giphy" : viewing ? "pack" : "main"
  const giphy = useGiphyFeed(
    "stickers",
    term,
    browsing && tab === "stickers" && view === "giphy"
  )
  const gifFeed = useGiphyFeed("gifs", term, open && tab === "gifs")
  const keep = useKeepSticker()
  const onTileAction = useTileActions()
  const save = useSaveStickerPack()
  const creator = useStickerCreator((sticker) =>
    onPickSticker?.(pickOfSticker(sticker))
  )

  const mainRows = tray.data
    ? pickerRows(tray.data, catalog.packs, premium)
    : []
  const jumps = pickerJumps(mainRows, packs)
  const rows =
    view === "giphy"
      ? giphyRows(giphy.items)
      : view === "pack"
        ? viewed
          ? packViewRows(viewed, premium)
          : []
        : mainRows

  useEffect(() => {
    if (viewing !== null || returnTo.current === 0) return
    listRef.current?.scrollTo({ top: returnTo.current })
    returnTo.current = 0
  }, [viewing])

  function close() {
    onOpenChange(false)
  }

  function leaveFor(path: string) {
    close()
    const leave = () => router.push(path)
    if (beforeLeaving) beforeLeaving(leave)
    else leave()
  }

  function rowOf(jump: PickerJump): HTMLElement | null {
    return (
      listRef.current?.querySelector<HTMLElement>(jumpSelector(jump)) ?? null
    )
  }

  function pickTile({ sticker, state }: StickerTile) {
    if (state === "held") {
      showNotice("This one is still being checked.")
      return
    }
    if (state === "locked") {
      leaveFor(PREMIUM_PATH)
      return
    }
    close()
    onPickSticker?.(pickOfSticker(sticker))
  }

  function stopSearching() {
    setQuery("")
    setSearching(false)
  }

  return {
    title: tab === "gifs" ? "GIFs" : "Stickers",
    listRef,
    onScroll: () => {
      const list = listRef.current
      if (!list || view !== "main") return
      const top = list.getBoundingClientRect().top
      let next: string | null = null
      for (const jump of jumps) {
        const row = rowOf(jump)
        if (!row || row.getBoundingClientRect().top - top > 8) break
        next = jump.key
      }
      setCurrent(next)
    },
    bar: {
      tabs: stickers && gifs ? (["stickers", "gifs"] as const) : null,
      tab,
      onTab: (next: PickerTab) => {
        setChosen(next)
        stopSearching()
        setViewing(null)
      },
      jumps: view === "main" && tab === "stickers" ? jumps : [],
      current: current ?? jumps[0]?.key ?? null,
      onJump: (jump: PickerJump) => {
        setCurrent(jump.key)
        rowOf(jump)?.scrollIntoView({
          block: "start",
          behavior: "smooth",
        })
      },
      attribution: tab === "gifs" || view === "giphy",
    },
    search: {
      value: query,
      placeholder: tab === "gifs" ? "Search GIFs" : "Search stickers",
      active: searching || query.length > 0,
      onChange: setQuery,
      onFocus: () => {
        if (tab === "stickers") setSearching(true)
      },
      onClear: stopSearching,
    },
    stickers:
      tab === "stickers"
        ? {
            rows,
            loading:
              view === "main"
                ? tray.isPending
                : view === "pack"
                  ? !viewed && fetched.isPending
                  : giphy.loading && giphy.items.length === 0,
            failed:
              view === "main"
                ? tray.isError
                : view === "pack"
                  ? !viewed && fetched.isError
                  : giphy.failed,
            retry: () =>
              void (view === "giphy"
                ? giphy.retry()
                : view === "pack"
                  ? fetched.refetch()
                  : tray.refetch()),
            more:
              view === "main" && catalog.hasMore
                ? { loading: catalog.loadingMore, onReach: catalog.loadMore }
                : null,
            onMake: tray.data
              ? () => {
                  const favourites = tray.data.favourites.id
                  close()
                  creator.begin(favourites)
                }
              : undefined,
            onPick: pickTile,
            onAction: onTileAction,
            onPickGiphy: (gif: Gif) => {
              close()
              onPickSticker?.(pickOfGiphy(gif))
            },
            onKeepGiphy: keep
              ? (gif: Gif) => keep({ giphyId: gif.id })
              : undefined,
            onOpenPack: (packId: string) => {
              returnTo.current = listRef.current?.scrollTop ?? 0
              listRef.current?.scrollTo({ top: 0 })
              setViewing(packId)
            },
            onBack: () => setViewing(null),
            onToggleSave: (pack: StickerPack) => save.toggle(pack),
          }
        : null,
    gifs:
      tab === "gifs"
        ? {
            items: gifFeed.items,
            loading: gifFeed.loading,
            failed: gifFeed.failed,
            retry: gifFeed.retry,
            onPick: (gif: Gif) => {
              close()
              onPickGif?.(gif)
            },
          }
        : null,
    creator,
  }
}

export type StickerPickerState = ReturnType<typeof useStickerPicker>
