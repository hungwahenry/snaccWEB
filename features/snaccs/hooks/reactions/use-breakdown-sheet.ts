"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { getReactionSummary, listReactions } from "../../api"
import type { Snacc } from "../../types"
import { snaccKeys } from "../../utils/keys"

export function useBreakdownSheet() {
  const [viewing, setViewing] = useState<Snacc | null>(null)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<string | null>(null)
  const snaccId = viewing?.id ?? null

  const summary = useQuery({
    queryKey: snaccKeys.reactionSummary(snaccId ?? ""),
    queryFn: () => getReactionSummary(snaccId!),
    enabled: snaccId !== null && open,
  })
  const reactors = useInfiniteList(
    snaccKeys.reactors(snaccId ?? "", filter),
    (page) => listReactions(snaccId!, filter ?? undefined, page),
    { enabled: snaccId !== null && open }
  )

  return {
    onOpen(snacc: Snacc) {
      setViewing(snacc)
      setFilter(null)
      setOpen(true)
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      total: viewing?.reactions_count ?? 0,
      filter,
      tallies: summary.data ?? [],
      reactors: reactors.items,
      loading: reactors.loading,
      loadingMore: reactors.loadingMore,
      loadMore: reactors.loadMore,
      filterBy: setFilter,
    },
  }
}
