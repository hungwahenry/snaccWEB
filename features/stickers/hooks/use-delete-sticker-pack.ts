"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { confirm } from "@/components/ui/confirm"
import { showError, showSuccess } from "@/lib/feedback"
import { deleteStickerPack } from "../api"
import { dropPack, refreshStickerPacks, refreshStickerTray } from "../cache"
import { STICKERS_PATH } from "../routes"

export function useDeleteStickerPack(): (packId: string) => void {
  const router = useRouter()
  const remove = useMutation({
    mutationFn: deleteStickerPack,
    onMutate: (packId) => {
      dropPack(packId)
      router.replace(STICKERS_PATH)
    },
    onSuccess: () => showSuccess("Pack deleted."),
    onError: (error) => showError(error),
    onSettled: () => {
      refreshStickerPacks()
      refreshStickerTray()
    },
  })

  return (packId) =>
    confirm({
      title: "Delete this pack?",
      message:
        "It's gone for good, from your tray and everyone else's. Stickers you already sent stay where they are.",
      actions: [
        {
          label: "Delete",
          destructive: true,
          onPress: () => remove.mutate(packId),
        },
      ],
    })
}
