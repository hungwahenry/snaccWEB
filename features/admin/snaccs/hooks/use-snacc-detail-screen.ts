"use client"

import { useSnacc, useSnaccActions } from "./use-snaccs"

export function useSnaccDetailScreen(id: string) {
  return { query: useSnacc(id), actions: useSnaccActions() }
}
