"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import {
  getTrendingGifs,
  getTrendingGiphyStickers,
  searchGifs,
  searchGiphyStickers,
} from "../api"
import type { Gif, GiphyKind } from "../types"
import { giphyKeys } from "../utils/keys"

const NONE: Gif[] = []

const SOURCES = {
  gifs: { search: searchGifs, trending: getTrendingGifs },
  stickers: { search: searchGiphyStickers, trending: getTrendingGiphyStickers },
} satisfies Record<
  GiphyKind,
  { search: (term: string) => Promise<Gif[]>; trending: () => Promise<Gif[]> }
>

/** Trending until there are words to search for, then the search. */
export function useGiphyFeed(kind: GiphyKind, query: string, enabled = true) {
  const term = query.trim()
  const searching = term.length > 0
  const source = SOURCES[kind]

  const result = useQuery({
    queryKey: searching
      ? giphyKeys.search(kind, term)
      : giphyKeys.trending(kind),
    queryFn: () => (searching ? source.search(term) : source.trending()),
    enabled,
    staleTime: 5 * MINUTE_MS,
    placeholderData: (previous, previousQuery) =>
      previousQuery?.queryKey[1] === kind ? previous : undefined,
  })

  return {
    items: result.data ?? NONE,
    searching,
    loading: result.isFetching,
    failed: result.isError,
    retry: () => void result.refetch(),
  }
}
