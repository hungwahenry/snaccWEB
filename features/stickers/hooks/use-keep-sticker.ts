"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { confirm } from "@/components/ui/confirm"
import { useFlag } from "@/features/config/hooks/use-flag"
import { toastError } from "@/features/premium/utils/limit-toast"
import { getErrorMessage } from "@/lib/api/errors"
import {
  deleteSticker,
  saveGiphySticker,
  saveMessageSticker,
  saveSnaccSticker,
} from "../api"
import { invalidateStickers } from "./use-sticker-library"

function stickerKept() {
  invalidateStickers()
  toast.success("Saved to your stickers.")
}

const feedback = {
  onSuccess: stickerKept,
  onError: (error: unknown) => toastError(error),
}

export function useSaveGiphySticker() {
  return useMutation({ mutationFn: saveGiphySticker, ...feedback })
}

export function useDeleteSticker() {
  return useMutation({
    mutationFn: deleteSticker,
    onSuccess: invalidateStickers,
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function confirmKeepSticker(keep: () => void) {
  confirm({
    title: "Keep this sticker?",
    message: "It'll wait in Mine on the sticker tray.",
    actions: [{ label: "Keep", onPress: keep }],
  })
}

export function useKeepSnaccSticker(): ((snaccId: string) => void) | undefined {
  const enabled = useFlag("stickers")
  const save = useMutation({ mutationFn: saveSnaccSticker, ...feedback })

  if (!enabled) return undefined
  return (snaccId) => confirmKeepSticker(() => save.mutate(snaccId))
}

export function useKeepMessageSticker():
  ((messageId: string) => void) | undefined {
  const enabled = useFlag("stickers")
  const save = useMutation({ mutationFn: saveMessageSticker, ...feedback })

  if (!enabled) return undefined
  return (messageId) => save.mutate(messageId)
}
