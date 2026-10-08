"use client"

import { useMutation } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { showError } from "@/lib/feedback"
import { getQueryClient } from "@/lib/query/client"
import { removePackSticker } from "../api"
import { dropPackSticker, refreshStickerPacks, restorePack } from "../cache"
import { stickerKeys } from "../utils/keys"

export function useRemovePackSticker(): (
  packId: string,
  stickerId: string
) => void {
  const remove = useMutation({
    mutationFn: removePackSticker,
    onMutate: async ({ packId, stickerId }) => {
      await getQueryClient().cancelQueries({
        queryKey: stickerKeys.pack(packId),
      })
      return dropPackSticker(packId, stickerId)
    },
    onSuccess: refreshStickerPacks,
    onError: (error, { packId }, previous) => {
      restorePack(packId, previous)
      showError(error)
    },
  })

  return (packId, stickerId) =>
    confirm({
      title: "Remove this sticker?",
      message: "It leaves this pack. Anywhere you already sent it stays.",
      actions: [
        {
          label: "Remove",
          destructive: true,
          onPress: () => remove.mutate({ packId, stickerId }),
        },
      ],
    })
}
