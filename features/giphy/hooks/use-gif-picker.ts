"use client"

import { useState } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { Gif } from "../types"
import { useGifSearch, useGifTrending } from "./use-gifs"

/// Everything the GIF picker sheet needs: open state, a debounced search, trending as the default.
export function useGifPicker(onPick: (gif: Gif) => void) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const debounced = useDebouncedValue(query.trim(), 300)
  const search = useGifSearch(debounced)
  const trending = useGifTrending(open && debounced.length === 0)

  return {
    show: () => setOpen(true),
    sheet: {
      open,
      onOpenChange: (next: boolean) => {
        setOpen(next)
        if (!next) setQuery("")
      },
      query,
      onQueryChange: setQuery,
      gifs: (debounced.length > 0 ? search.data : trending.data) ?? [],
      loading: debounced.length > 0 ? search.isFetching : trending.isFetching,
      onPick: (gif: Gif) => {
        onPick(gif)
        setOpen(false)
        setQuery("")
      },
    },
  }
}
