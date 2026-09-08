"use client"

import { useRouter } from "next/navigation"
import { createElement, useEffect, useMemo, useRef } from "react"
import { toast } from "sonner"
import { signal } from "@/features/signals/utils/queue"
import { useKeepSnaccSticker } from "@/features/stickers/hooks/use-keep-sticker"
import { useStickerStudio } from "@/providers/sticker-studio-provider"
import { useLightbox } from "@/providers/lightbox-provider"
import { getErrorMessage } from "@/lib/api/errors"
import { discardSnacc, retrySnacc } from "../cache/pending-snaccs"
import { LightboxActions } from "../components/card/lightbox-actions"
import type { SnaccActionHandlers } from "../components/card/snacc-card"
import { resnaccsPath, snaccPath } from "../routes"
import type { EmbeddedSnacc, Snacc, SnaccPollOption } from "../types"
import { useBreakdownSheet } from "./reactions/use-breakdown-sheet"
import { useReactToSnacc } from "./reactions/use-react-to-snacc"
import { useResnaccSheet } from "./resnaccs/use-resnacc-sheet"
import { useSnaccMenu } from "./use-snacc-menu"
import { useVotePoll } from "./use-vote-poll"

type Overrides = {
  onComment?: (snacc: Snacc) => void
  onPress?: (snacc: Snacc) => void | false
}

/// Everything a snacc card can do, wired once per screen. The handlers are stable so memoised
/// cards do not re-render when unrelated state changes.
export function useSnaccActions(overrides: Overrides = {}) {
  const router = useRouter()
  const react = useReactToSnacc()
  const breakdown = useBreakdownSheet()
  const resnacc = useResnaccSheet()
  const menu = useSnaccMenu()
  const poll = useVotePoll()
  const lightbox = useLightbox()
  const stickerStudio = useStickerStudio()
  const keepSticker = useKeepSnaccSticker()

  const latest = useRef({
    react,
    breakdown,
    resnacc,
    menu,
    poll,
    lightbox,
    overrides,
    router,
    stickerStudio,
    keepSticker,
  })

  useEffect(() => {
    latest.current = {
      react,
      breakdown,
      resnacc,
      menu,
      poll,
      lightbox,
      overrides,
      router,
      stickerStudio,
      keepSticker,
    }
  })

  const handlers = useMemo<SnaccActionHandlers>(() => {
    const onComment = (snacc: Snacc) => {
      const { onComment: override } = latest.current.overrides
      if (override) override(snacc)
      else latest.current.router.push(snaccPath(snacc.id))
    }

    return {
      onReact: (snacc, emoji) =>
        latest.current.react.mutate(
          {
            snaccId: snacc.id,
            emoji: snacc.my_reaction === emoji ? null : emoji,
          },
          { onError: (error) => toast.error(getErrorMessage(error)) }
        ),
      onOpenBreakdown: (snacc) => latest.current.breakdown.onOpen(snacc),
      onOpenResnaccs: (snacc) =>
        latest.current.router.push(resnaccsPath(snacc.id)),
      onResnacc: (snacc) => latest.current.resnacc.onOpen(snacc),
      onOpenActions: (snacc) => latest.current.menu.onOpen(snacc),
      onShare: (snacc) => latest.current.menu.onShare(snacc),
      onComment,
      onPress: (snacc) => {
        const { onPress } = latest.current.overrides
        if (onPress) {
          if (onPress(snacc) !== false) return
        }
        latest.current.router.push(snaccPath(snacc.id))
      },
      onPressQuote: (quote: EmbeddedSnacc) =>
        latest.current.router.push(snaccPath(quote.id)),
      onOpenImages: (snacc, index) => {
        const { lightbox } = latest.current
        signal("image_open", { subjectId: snacc.id, value: index })
        // A quoted snacc carries no counts, so only a full card gets the action bar.
        const footer =
          "resnacc_of" in snacc
            ? createElement(LightboxActions, {
                reactions: snacc.reactions,
                reactionsCount: snacc.reactions_count,
                commentsCount: snacc.comments_count,
                resnaccsCount: snacc.resnaccs_count,
                onOpenBreakdown: () => {
                  lightbox.close()
                  latest.current.breakdown.onOpen(snacc)
                },
                onComment: () => {
                  lightbox.close()
                  onComment(snacc)
                },
                onResnacc: () => {
                  lightbox.close()
                  latest.current.resnacc.onOpen(snacc)
                },
              })
            : undefined
        lightbox.open({ images: snacc.images, index, footer })
      },
      onVote: (snacc, optionId) => latest.current.poll.vote(snacc.id, optionId),
      onOpenPollImage: (snacc, option: SnaccPollOption) => {
        const gallery =
          snacc.poll?.options.filter((entry) => entry.image !== null) ?? []
        const index = gallery.findIndex((entry) => entry.id === option.id)
        if (index >= 0) {
          latest.current.lightbox.open({
            images: gallery.map((entry) => ({
              url: entry.image!.url,
              width: entry.image!.width,
              height: entry.image!.height,
            })),
            index,
          })
        }
      },
      onRetry: (snacc) => retrySnacc(snacc.id),
      onDiscard: (snacc) => discardSnacc(snacc.id),
      onHoldImage: (snacc, index) => {
        const image = snacc.images[index]
        if (image) latest.current.stickerStudio?.(image)
      },
      onKeepSticker: (snacc) => latest.current.keepSticker?.(snacc.id),
    }
  }, [])

  return {
    handlers,
    votingPollFor: poll.votingFor,
    sheets: {
      breakdown: breakdown.sheet,
      resnacc: resnacc.sheet,
      actions: menu.sheet,
      report: menu.report,
      share: menu.shareCard,
    },
  }
}

export type SnaccSheets = ReturnType<typeof useSnaccActions>["sheets"]
