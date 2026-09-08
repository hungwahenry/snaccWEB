"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef } from "react"
import { toast } from "sonner"
import { useLightbox } from "@/providers/lightbox-provider"
import { getErrorMessage } from "@/lib/api/errors"
import { discardSnacc, retrySnacc } from "../cache/pending-snaccs"
import type { SnaccActionHandlers } from "../components/card/snacc-card"
import { snaccPath } from "../routes"
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

  const latest = useRef({
    react,
    breakdown,
    resnacc,
    menu,
    poll,
    lightbox,
    overrides,
    router,
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
    }
  })

  const handlers = useMemo<SnaccActionHandlers>(
    () => ({
      onReact: (snacc, emoji) =>
        latest.current.react.mutate(
          {
            snaccId: snacc.id,
            emoji: snacc.my_reaction === emoji ? null : emoji,
          },
          { onError: (error) => toast.error(getErrorMessage(error)) }
        ),
      onOpenBreakdown: (snacc) => latest.current.breakdown.onOpen(snacc),
      onResnacc: (snacc) => latest.current.resnacc.onOpen(snacc),
      onOpenActions: (snacc) => latest.current.menu.onOpen(snacc),
      onShare: (snacc) => latest.current.menu.onShare(snacc),
      onComment: (snacc) => {
        const { onComment } = latest.current.overrides
        if (onComment) onComment(snacc)
        else latest.current.router.push(snaccPath(snacc.id))
      },
      onPress: (snacc) => {
        const { onPress } = latest.current.overrides
        if (onPress) {
          if (onPress(snacc) !== false) return
        }
        latest.current.router.push(snaccPath(snacc.id))
      },
      onPressQuote: (quote: EmbeddedSnacc) =>
        latest.current.router.push(snaccPath(quote.id)),
      onOpenImages: (snacc, index) =>
        latest.current.lightbox.open({ images: snacc.images, index }),
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
    }),
    []
  )

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
