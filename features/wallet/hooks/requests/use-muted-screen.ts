"use client"

import { usePendingVariables } from "@/hooks/use-pending-variables"
import { walletMutationKeys } from "../../utils/keys"
import { useMutes, useUnmute } from "./use-mutes"

export function useMutedScreen() {
  const mutes = useMutes()
  const unmute = useUnmute()
  const unmuting = usePendingVariables<string>(walletMutationKeys.unmute())

  return {
    loading: mutes.isPending,
    failed: mutes.isError,
    retry: () => void mutes.refetch(),
    muted: mutes.data ?? [],
    isBusy: (userId: string) => unmuting.includes(userId),
    unmute: (userId: string) => unmute(userId),
  }
}

export type MutedScreenProps = ReturnType<typeof useMutedScreen>
