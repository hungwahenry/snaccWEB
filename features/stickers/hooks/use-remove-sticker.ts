"use client"

import { useMutation } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { showError } from "@/lib/feedback"
import { getQueryClient } from "@/lib/query/client"
import { deleteSticker } from "../api"
import { dropFromLibrary, restoreLibrary } from "../cache"
import { stickerKeys } from "../utils/keys"

export function useRemoveSticker(): (id: string) => void {
  const remove = useMutation({
    mutationFn: deleteSticker,
    onMutate: async (id) => {
      await getQueryClient().cancelQueries({ queryKey: stickerKeys.library() })
      return dropFromLibrary(id)
    },
    onError: (error, _id, previous) => {
      restoreLibrary(previous)
      showError(error)
    },
  })

  return (id) =>
    confirm({
      title: "Remove this sticker?",
      message: "It leaves your library; anywhere you sent it stays.",
      actions: [
        {
          label: "Remove",
          destructive: true,
          onPress: () => remove.mutate(id),
        },
      ],
    })
}
