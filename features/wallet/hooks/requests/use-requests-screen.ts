"use client"

import { useState } from "react"
import type { RequestBox } from "../../types"
import { useRequestSheet } from "./use-request-sheet"
import { useRequests } from "./use-requests"

const EMPTY: Record<RequestBox, { title: string; description: string }> = {
  incoming: {
    title: "No requests yet",
    description: "No one is asking you for money.",
  },
  outgoing: {
    title: "Nothing asked yet",
    description: "You have not asked anyone yet.",
  },
}

export function useRequestsScreen() {
  const [box, setBox] = useState<RequestBox>("incoming")
  const list = useRequests(box)
  const { actions, open, sheet } = useRequestSheet()

  return {
    box,
    setBox,
    // The previous box's rows would read as this box's until the new page lands.
    list: {
      items: list.stale ? [] : list.items,
      loading: list.loading || list.stale,
      failed: list.failed,
      retry: list.retry,
      loadingMore: list.loadingMore,
      loadMore: list.loadMore,
    },
    empty: EMPTY[box],
    isBusy: actions.isBusy,
    open,
    sheet: { ...sheet, box },
  }
}

export type RequestsScreenProps = ReturnType<typeof useRequestsScreen>
