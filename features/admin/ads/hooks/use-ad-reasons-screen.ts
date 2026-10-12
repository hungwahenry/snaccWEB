"use client"

import { useAdReasonActions, useAdReasons } from "./use-ad-reasons"

export function useAdReasonsScreen() {
  return {
    query: useAdReasons(),
    actions: useAdReasonActions(),
  }
}
