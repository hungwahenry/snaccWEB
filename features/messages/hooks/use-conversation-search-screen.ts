"use client"

import { useState } from "react"
import { useBack } from "@/hooks/use-back"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { conversationDetailsPath } from "../routes"
import { MIN_SEARCH } from "../utils/search"
import { useMessageSearch } from "./use-message-search"

export function useConversationSearchScreen(id: string) {
  const back = useBack(conversationDetailsPath(id))
  const [query, setQuery] = useState("")
  const term = useDebouncedValue(query.trim(), 300)
  const ready = term.length >= MIN_SEARCH
  const search = useMessageSearch(ready ? term : "", id)
  const hits = search.data?.items ?? []

  return {
    query,
    onChange: setQuery,
    onCancel: back,
    hits,
    idle: !ready,
    searching: ready && search.isPending,
    failed: ready && search.isError,
    retry: () => void search.refetch(),
    nothingFound: ready && search.isSuccess && hits.length === 0,
  }
}
