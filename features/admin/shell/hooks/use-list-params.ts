"use client"

import {
  parseAsInteger,
  useQueryStates,
  type Nullable,
  type UseQueryStatesKeysMap,
  type Values,
} from "nuqs"
import { useCallback, useMemo } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { isFiltered } from "../utils/list-params"

const PAGE = { page: parseAsInteger.withDefault(1) }

const SEARCH_DEBOUNCE_MS = 300

type Keys<F extends UseQueryStatesKeysMap> = typeof PAGE & F

/**
 * Paging and filters for an admin list, kept in the URL so a reload, a shared link or the back
 * button lands on the same view. `filters` must be a module-level constant. `query` is what to
 * fetch with: the same values, with a search term that only settles once typing pauses.
 */
export function useListParams<F extends UseQueryStatesKeysMap>(filters: F) {
  const keys = useMemo<Keys<F>>(() => ({ ...PAGE, ...filters }), [filters])
  const [values, setValues] = useQueryStates(keys, {
    history: "replace",
    clearOnDefault: true,
  })

  const search = (values as { q?: unknown }).q
  const settled = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)
  const query = useMemo(
    () => ("q" in keys ? { ...values, q: settled } : values) as Values<Keys<F>>,
    [keys, values, settled]
  )

  const setFilter = useCallback(
    (patch: Partial<Nullable<Values<F>>>) =>
      void setValues({ ...patch, page: null } as Partial<
        Nullable<Values<Keys<F>>>
      >),
    [setValues]
  )

  const setPage = useCallback(
    (page: number) =>
      void setValues({ page } as Partial<Nullable<Values<Keys<F>>>>),
    [setValues]
  )

  const reset = useCallback(() => void setValues(null), [setValues])

  return {
    values,
    query,
    setFilter,
    setPage,
    reset,
    filtered: isFiltered(filters, values),
  }
}
