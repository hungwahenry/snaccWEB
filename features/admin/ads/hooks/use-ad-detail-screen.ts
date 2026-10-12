"use client"

import { useRejectionChoices } from "./use-ad-reasons"
import { useAd, useAdActions } from "./use-ads"

export function useAdDetailScreen(id: string) {
  return {
    query: useAd(id),
    actions: useAdActions(id),
    reasons: useRejectionChoices(),
  }
}
