"use client"

import { useFlagActions, useFlagGroups } from "./use-flags"

export function useFlagsScreen() {
  return { query: useFlagGroups(), actions: useFlagActions() }
}
