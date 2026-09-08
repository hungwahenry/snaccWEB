"use client"

import {
  FilmIcon,
  HeartIcon,
  SearchXIcon,
  StickerIcon,
  type LucideIcon,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { confirm } from "@/components/ui/confirm"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useGifSearch, useGifTrending } from "@/features/giphy/hooks/use-gifs"
import type { Gif } from "@/features/giphy/types"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getErrorMessage } from "@/lib/api/errors"
import { saveGiphySticker } from "../api"
import type { Sticker } from "../types"
import {
  confirmKeepSticker,
  useDeleteSticker,
  useSaveGiphySticker,
} from "./use-keep-sticker"
import { invalidateStickers, useStickerLibrary } from "./use-sticker-library"
import { useStickerSearch, useStickerTrending } from "./use-sticker-search"

export type TrayTab = "stickers" | "gifs" | "mine"

export interface TrayTile {
  id: string
  url: string
  preview_url: string | null
  width: number
  height: number
}

export interface TrayGrid {
  items: TrayTile[]
  loading: boolean
  empty: { icon: LucideIcon; title: string; description?: string }
  onPick: (item: TrayTile) => void
  onLongPress?: (item: TrayTile) => void
  onEndReached?: () => void
}

interface TrayOptions {
  onPickSticker?: (sticker: Sticker) => void
  onPickGif?: (gif: Gif) => void
  close: () => void
}

export function useStickerTray({
  onPickSticker,
  onPickGif,
  close,
}: TrayOptions) {
  const gifsEnabled = useFlag("giphy") && !!onPickGif
  const stickersEnabled = useFlag("stickers") && !!onPickSticker
  const [tab, setTab] = useState<TrayTab>(stickersEnabled ? "stickers" : "gifs")
  const [query, setQuery] = useState("")
  const debounced = useDebouncedValue(query, 300)
  const searching = debounced.trim().length > 0

  const save = useSaveGiphySticker()
  const remove = useDeleteSticker()
  const library = useStickerLibrary({ enabled: tab === "mine" })
  const stickerSearch = useStickerSearch(
    debounced,
    tab === "stickers" && searching
  )
  const stickerTrending = useStickerTrending(tab === "stickers" && !searching)
  const gifSearch = useGifSearch(tab === "gifs" && searching ? debounced : "")
  const gifTrending = useGifTrending(tab === "gifs" && !searching)

  function pickTab(next: TrayTab) {
    setTab(next)
    setQuery("")
  }

  function sendGiphySticker(sticker: Gif) {
    close()
    // Save-then-send as a bare promise: the mutation hook unmounts with the tray and drops its
    // callbacks, which would eat the send.
    void saveGiphySticker(sticker.id)
      .then((saved) => {
        invalidateStickers()
        onPickSticker?.(saved)
      })
      .catch((error) => toast.error(getErrorMessage(error)))
  }

  function confirmDelete(sticker: Sticker) {
    confirm({
      title: "Remove this sticker?",
      message: "It leaves your library; anywhere you sent it stays.",
      actions: [
        {
          label: "Remove",
          destructive: true,
          onPress: () => remove.mutate(sticker.id),
        },
      ],
    })
  }

  const grid: TrayGrid =
    tab === "stickers"
      ? {
          items: (searching ? stickerSearch.data : stickerTrending.data) ?? [],
          loading: (searching ? stickerSearch : stickerTrending).isFetching,
          empty: searching
            ? {
                icon: SearchXIcon,
                title: "Nothing matched",
                description: "Try another word.",
              }
            : {
                icon: StickerIcon,
                title: "No stickers right now",
                description: "Check back in a bit.",
              },
          onPick: (item) => sendGiphySticker(item as Gif),
          onLongPress: (item) => confirmKeepSticker(() => save.mutate(item.id)),
        }
      : tab === "gifs"
        ? {
            items: (searching ? gifSearch.data : gifTrending.data) ?? [],
            loading: (searching ? gifSearch : gifTrending).isFetching,
            empty: searching
              ? {
                  icon: SearchXIcon,
                  title: "Nothing matched",
                  description: "Try another word.",
                }
              : {
                  icon: FilmIcon,
                  title: "No GIFs right now",
                  description: "Check back in a bit.",
                },
            onPick: (item) => {
              close()
              onPickGif?.(item as Gif)
            },
          }
        : {
            items: library.stickers,
            loading: library.loading,
            empty: {
              icon: HeartIcon,
              title: "Nothing saved yet",
              description: "Hold any sticker to keep it here.",
            },
            onPick: (item) => {
              close()
              onPickSticker?.(item as Sticker)
            },
            onLongPress: (item) => confirmDelete(item as Sticker),
            onEndReached: library.loadMore,
          }

  return {
    tab,
    pickTab,
    gifsEnabled,
    stickersEnabled,
    query,
    setQuery,
    showSearch: tab !== "mine",
    searchPlaceholder: tab === "gifs" ? "Search GIFs" : "Search stickers",
    grid,
  }
}
