"use client"

import { useAdButtonActions, useAdButtons } from "./use-ad-buttons"

export function useAdButtonsScreen() {
  return {
    query: useAdButtons(),
    actions: useAdButtonActions(),
  }
}
