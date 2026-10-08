"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { confirm } from "@/components/ui/confirm"
import { showSuccess } from "@/lib/feedback"
import { deleteStickerPack } from "../api"
import { refreshStickerPacks } from "../cache"
import { MY_STICKER_PACKS_PATH } from "../routes"

export function useDeleteStickerPack(): (packId: string) => void {
  const router = useRouter()
  const remove = useMutation({
    mutationFn: deleteStickerPack,
    onSuccess: () => {
      refreshStickerPacks()
      router.replace(MY_STICKER_PACKS_PATH)
      showSuccess("Pack deleted.")
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
