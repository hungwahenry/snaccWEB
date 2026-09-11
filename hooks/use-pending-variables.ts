"use client"

import { useMutationState, type MutationKey } from "@tanstack/react-query"

/**
 * What every in-flight run of a mutation was called with, so each row of a list can show its own
 * pending state and two rows can be busy at once.
 */
export function usePendingVariables<T>(mutationKey: MutationKey): T[] {
  return useMutationState({
    filters: { mutationKey, status: "pending" },
    select: (mutation) => mutation.state.variables as T,
  })
}
