"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { newId } from "@/lib/ids"
import type { PickedImage } from "@/lib/media"
import { createMoment } from "../api"
import type { MomentMode } from "../types"
import { DEFAULT_BACKGROUND } from "../utils/backgrounds"
import { authorMomentsKey, MOMENTS_TRAY_KEY } from "../utils/keys"
import { showError, showHeld } from "@/lib/feedback"

const COUNTER_APPEARS_AT = 80

export function useMomentComposer(onPosted: () => void) {
  const [mode, setMode] = useState<MomentMode>("text")
  const [body, setBody] = useState("")
  const [image, setImage] = useState<PickedImage | null>(null)
  const [background, setBackground] = useState<string>(DEFAULT_BACKGROUND)

  const maxLength = useConfigValue("moments.caption_max_length")
  const me = useMe()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: createMoment,
    onSuccess: (moment) => {
      if (moment.held) {
        showHeld()
        onPosted()
        return
      }

      onPosted()
      void queryClient.invalidateQueries({ queryKey: MOMENTS_TRAY_KEY })
      void queryClient.invalidateQueries({
        queryKey: authorMomentsKey(moment.author.id),
      })
    },
    onError: (error) => showError(error),
  })

  const trimmed = body.trim()
  const remaining = maxLength - trimmed.length
  const ready =
    remaining >= 0 && (mode === "text" ? trimmed.length > 0 : image !== null)

  const post = useCallback(() => {
    if (!ready || isPending) return

    mutate({
      id: newId(),
      body: trimmed || undefined,
      ...(mode === "text" ? { background } : { image: image ?? undefined }),
    })
  }, [ready, isPending, mutate, trimmed, mode, background, image])

  return {
    mode,
    setMode,
    body,
    setBody,
    background,
    setBackground,
    image,
    setImage,
    clearImage: useCallback(() => setImage(null), []),
    avatarUrl: me.data?.profile?.avatar_url ?? null,
    username: me.data?.profile?.username ?? null,
    remaining,
    showCounter: remaining <= COUNTER_APPEARS_AT,
    canPost: ready,
    posting: isPending,
    post,
  }
}
