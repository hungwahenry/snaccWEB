"use client"

import { usePageActions, usePages } from "./use-pages"

export function usePagesScreen() {
  return { query: usePages(), actions: usePageActions() }
}
