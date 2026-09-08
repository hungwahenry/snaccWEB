"use client"

import { useCallback, useState } from "react"

/// Paging and filter state for an admin table. A patch always returns to page one, because
/// staying on page seven of a result set that no longer has seven pages is how a list looks broken.
export function useListState<T extends { page?: number }>(initial: T) {
  const [params, setParams] = useState<T>(initial)

  const patch = useCallback(
    (next: Partial<T>) =>
      setParams((current) => ({ ...current, page: 1, ...next })),
    []
  )

  return { params, patch }
}
