"use client"

import { useDrift, useHealth, useOpsActions, useQueues } from "./use-ops"

export function useOpsScreen() {
  return {
    health: useHealth(),
    queues: useQueues(),
    drift: useDrift(),
    actions: useOpsActions(),
  }
}
