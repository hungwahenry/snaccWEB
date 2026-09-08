"use client"

import { useEffect, useMemo, useState } from "react"
import {
  catalogLoaded,
  emojisFor,
  loadCatalog,
  QUICK_CATEGORY,
  searchEmojis,
  type Catalog,
  type PickerCategory,
} from "../utils/emoji"

export function useReactionPicker() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<PickerCategory>(QUICK_CATEGORY)
  const [catalog, setCatalog] = useState<Catalog | null>(catalogLoaded)
  const searching = query.trim().length > 0
  const needsCatalog = searching || category !== QUICK_CATEGORY

  useEffect(() => {
    if (!needsCatalog || catalog) return
    let cancelled = false
    void loadCatalog().then((next) => {
      if (!cancelled) setCatalog(next)
    })
    return () => {
      cancelled = true
    }
  }, [needsCatalog, catalog])

  const emojis = useMemo(
    () =>
      searching
        ? catalog
          ? searchEmojis(catalog, query)
          : []
        : emojisFor(catalog, category),
    [searching, catalog, query, category]
  )

  return {
    query,
    setQuery,
    category,
    setCategory,
    searching,
    loading: needsCatalog && !catalog,
    emojis,
  }
}
