"use client"

import { useRouter } from "next/navigation"
import { createElement, useEffect, useMemo, useRef } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { signal } from "@/features/signals/utils/queue"
import { useConfirmKeepSticker } from "@/features/stickers/hooks/use-keep-sticker"
import { useStickerStudio } from "@/providers/sticker-studio-provider"
import { useLightbox } from "@/providers/lightbox-provider"
import { discardSnacc, retrySnacc } from "../cache/pending-snaccs"
import { LightboxActions } from "../components/card/lightbox-actions"
import type { SnaccActionHandlers } from "../components/card/snacc-card"
import { resnaccsPath, snaccPath } from "../routes"
import type { EmbeddedSnacc, Snacc, SnaccPollOption } from "../types"
import { useLikeSnacc } from "./likes/use-like-snacc"
import { useLikersSheet } from "./likes/use-likers-sheet"
import { useResnaccSheet } from "./resnaccs/use-resnacc-sheet"
import { useSnaccMenu } from "./use-snacc-menu"
import { useVotePoll } from "./use-vote-poll"

type Overrides = {
  onComment?: (snacc: Snacc) => void
  onPress?: (snacc: Snacc) => void | false
}

export function useSnaccActions(overrides: Overrides = {}) {
  const router = useRouter()
  const canResnacc = useFlag("resnacc")
  const setLike = useLikeSnacc()
  const likers = useLikersSheet()
  const resnacc = useResnaccSheet()
  const menu = useSnaccMenu()
  const poll = useVotePoll()
  const lightbox = useLightbox()
  const stickerStudio = useStickerStudio()
  const keepSticker = useConfirmKeepSticker()

  const latest = useRef({
    setLike,
    likers,
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
      setLike,
      likers,
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

    const openLikers = (snacc: Snacc) => latest.current.likers.onOpen(snacc)
    const openResnacc = (snacc: Snacc) => latest.current.resnacc.onOpen(snacc)

    return {
      onSetLike: (snacc, liked) => latest.current.setLike(snacc, liked),
      onOpenLikers: openLikers,
      onOpenResnaccs: canResnacc
        ? (snacc) => latest.current.router.push(resnaccsPath(snacc.id))
        : undefined,
      onResnacc: canResnacc ? openResnacc : undefined,
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
        const footer =
          "resnacc_of" in snacc
            ? createElement(LightboxActions, {
                likesCount: snacc.likes_count,
                liked: snacc.liked,
                commentsCount: snacc.comments_count,
                resnaccsCount: snacc.resnaccs_count,
                onOpenLikers: () => {
                  lightbox.close()
                  openLikers(snacc)
                },
                onComment: () => {
                  lightbox.close()
                  onComment(snacc)
                },
                onResnacc: canResnacc
                  ? () => {
                      lightbox.close()
                      openResnacc(snacc)
                    }
                  : undefined,
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
      onKeepSticker: (snacc) =>
        latest.current.keepSticker?.({ snaccId: snacc.id }),
    }
  }, [canResnacc])

  return {
    handlers,
    votingPollFor: poll.votingFor,
    sheets: {
      likers: likers.sheet,
      resnacc: resnacc.sheet,
      actions: menu.sheet,
      report: menu.report,
      share: menu.shareCard,
    },
  }
}

export type SnaccSheets = ReturnType<typeof useSnaccActions>["sheets"]
