"use client"

import { useMutation } from "@tanstack/react-query"
import { usePendingVariables } from "@/hooks/use-pending-variables"
import { showError } from "@/lib/feedback"
import { saveStickerPack, unsaveStickerPack } from "../api"
import { refreshStickerTray, setPackSaved } from "../cache"
import type { StickerPack } from "../types"
import { stickerMutationKeys } from "../utils/keys"

interface SaveChange {
  packId: string
  saved: boolean
}

export function useSaveStickerPack() {
  const change = useMutation({
    mutationKey: stickerMutationKeys.save(),
    mutationFn: ({ packId, saved }: SaveChange) =>
      saved ? saveStickerPack(packId) : unsaveStickerPack(packId),
    onMutate: ({ packId, saved }) => setPackSaved(packId, saved),
    onError: (error, { packId, saved }) => {
      setPackSaved(packId, !saved)
      showError(error)
    },
    onSettled: refreshStickerTray,
  })
  const pending = usePendingVariables<SaveChange>(stickerMutationKeys.save())

  return {
    toggle: (pack: StickerPack) =>
      change.mutate({ packId: pack.id, saved: !pack.saved }),
    isPending: (packId: string) =>
      pending.some((variables) => variables.packId === packId),
  }
}
