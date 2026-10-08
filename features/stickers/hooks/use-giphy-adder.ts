"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useGiphyFeed } from "@/features/giphy/hooks/use-giphy-feed"
import type { Gif } from "@/features/giphy/types"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { showSuccess } from "@/lib/feedback"
import { addGiphySticker } from "../api"
import { packStickersChanged } from "../cache"

export function useGiphyAdder(packId: string | null) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const term = useDebouncedValue(query, 300)
  const feed = useGiphyFeed("stickers", term, open && packId !== null)
  const add = useMutation({
    mutationFn: (gif: Gif) => addGiphySticker(packId ?? "", gif.id),
    onSuccess: (sticker) => {
      packStickersChanged(sticker.pack_id)
      showSuccess("Added to the pack.")
    },
  })

  return {
    start: () => setOpen(true),
    view:
      open && packId !== null
        ? {
            query,
            onQueryChange: setQuery,
            items: feed.items,
            loading: feed.loading,
            failed: feed.failed,
            onRetry: feed.retry,
            onAdd: (gif: Gif) => add.mutate(gif),
            onDone: () => {
              setOpen(false)
              setQuery("")
            },
          }
        : null,
  }
}

export type GiphyAdderView = NonNullable<
  ReturnType<typeof useGiphyAdder>["view"]
>
