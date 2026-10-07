"use client"

import { useState } from "react"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listLikers } from "../../api"
import type { Snacc } from "../../types"
import { snaccKeys } from "../../utils/keys"

export function useLikersSheet() {
  const [snaccId, setSnaccId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const likers = useInfiniteList(
    snaccKeys.likers(snaccId ?? ""),
    (page) => listLikers(snaccId!, page),
    { enabled: snaccId !== null && open }
  )

  return {
    onOpen(snacc: Snacc) {
      setSnaccId(snacc.id)
      setOpen(true)
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      likers: likers.items,
      loading: likers.loading,
      loadingMore: likers.loadingMore,
      loadMore: likers.loadMore,
    },
  }
}
