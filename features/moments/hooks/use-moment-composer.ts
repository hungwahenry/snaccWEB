"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useCaretText } from "@/hooks/use-caret-text"
import { newId } from "@/lib/ids"
import type { PickedImage } from "@/lib/media"
import { createMoment } from "../api"
import { mentionLimitProblem } from "@/features/snaccs/utils/entities"
import type { ChosenMode, MomentMode, MomentSharing } from "../types"
import { DEFAULT_BACKGROUND } from "../utils/backgrounds"
import { momentContent } from "../utils/draft"
import { authorMomentsKey, MOMENTS_TRAY_KEY } from "../utils/keys"
import { showError, showHeld } from "@/lib/feedback"
import { useMomentLength } from "./use-moment-length"

const COUNTER_APPEARS_AT = 80

export function useMomentComposer(
  onPosted: () => void,
  sharing: MomentSharing | null
) {
  const [chosen, setChosen] = useState<ChosenMode>("text")
  const mode: MomentMode = sharing ? "snacc" : chosen
  const text = useCaretText()
  const { body } = text
  const [image, setImage] = useState<PickedImage | null>(null)
  const [background, setBackground] = useState<string>(DEFAULT_BACKGROUND)

  const maxLength = useConfigValue("moments.caption_max_length")
  const maxMentions = useConfigValue("moments.max_mentions")
  const length = useMomentLength()
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
  const tagProblem = mentionLimitProblem(trimmed, maxMentions, "moment")
  const content = momentContent(mode, {
    hasWords: trimmed.length > 0,
    background,
    image,
    sharing,
  })
  const ready = remaining >= 0 && tagProblem === null && content !== null

  const post = useCallback(() => {
    if (!ready || content === null || isPending) return

    mutate({
      id: newId(),
      body: trimmed || undefined,
      hours: length.picked ?? undefined,
      ...content,
    })
  }, [ready, content, isPending, mutate, trimmed, length.picked])

  return {
    mode,
    setMode: setChosen,
    body,
    setBody: text.setBody,
    cursor: text.cursor,
    setCursor: text.setCursor,
    replaceRange: text.replaceRange,
    background,
    setBackground,
    image,
    setImage,
    clearImage: useCallback(() => setImage(null), []),
    length: length.chip,
    avatarUrl: me.data?.profile?.avatar_url ?? null,
    username: me.data?.profile?.username ?? null,
    remaining,
    tagProblem,
    showCounter: remaining <= COUNTER_APPEARS_AT,
    canPost: ready,
    posting: isPending,
    post,
  }
}
