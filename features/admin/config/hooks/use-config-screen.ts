"use client"

import { useConfigActions, useConfigGroups } from "./use-config"

export function useConfigScreen() {
  return { query: useConfigGroups(), actions: useConfigActions() }
}
