"use client"

import { useMutation } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { useFlag } from "@/features/config/hooks/use-flag"
import { showSuccess } from "@/lib/feedback"
import {
  saveChatMessageSticker,
  saveGiphySticker,
  saveMessageSticker,
  saveSnaccSticker,
} from "../api"
import { refreshStickerLibrary } from "../cache"

function confirmKeep(keep: () => void) {
  confirm({
    title: "Keep this sticker?",
    message: "It'll wait in Mine on the sticker tray.",
    actions: [{ label: "Keep", onPress: keep }],
  })
}

function useKeep(save: (id: string) => Promise<unknown>) {
  const enabled = useFlag("stickers")
  const mutation = useMutation({
    mutationFn: save,
    onSuccess: () => {
      refreshStickerLibrary()
      showSuccess("Saved to your stickers.")
    },
  })

  return enabled ? mutation.mutate : undefined
}

/** Asks first: holding a Giphy sticker in the tray is easy to do by accident. */
export function useKeepGiphySticker(): ((giphyId: string) => void) | undefined {
  const keep = useKeep(saveGiphySticker)
  return keep && ((giphyId) => confirmKeep(() => keep(giphyId)))
}

export function useKeepSnaccSticker(): ((snaccId: string) => void) | undefined {
  const keep = useKeep(saveSnaccSticker)
  return keep && ((snaccId) => confirmKeep(() => keep(snaccId)))
}

/** No question: the message menu's "Keep sticker" is already a deliberate choice. */
export function useKeepMessageSticker():
  ((messageId: string) => void) | undefined {
  return useKeep(saveMessageSticker)
}

export function useKeepChatMessageSticker():
  ((chatMessageId: string) => void) | undefined {
  return useKeep(saveChatMessageSticker)
}
