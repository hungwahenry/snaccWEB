"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { getMutes, unmuteRequester } from "../../api"
import { removeMute } from "../../cache"
import { walletKeys, walletMutationKeys } from "../../utils/keys"

export function useMutes() {
  return useQuery({ queryKey: walletKeys.mutes(), queryFn: getMutes })
}

export function useUnmute() {
  const unmute = useMutation({
    mutationKey: walletMutationKeys.unmute(),
    mutationFn: unmuteRequester,
    onSuccess: (_result, userId) => removeMute(userId),
  })

  return unmute.mutate
}
