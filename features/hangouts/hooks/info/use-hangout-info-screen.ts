"use client"

import { useRouter } from "next/navigation"
import { useGhostWindow } from "@/features/ghost/hooks/use-ghost-window"
import { composePath, snaccPath } from "@/features/snaccs/routes"
import { useBack } from "@/hooks/use-back"
import { useNow } from "@/hooks/use-now"
import {
  editHangoutPath,
  hangoutMembersPath,
  hangoutRequestsPath,
  hangoutSnaccsPath,
} from "../../routes"
import {
  canPostFrom,
  isOngoing,
  placeLine,
  whenLine,
} from "../../utils/hangouts"
import { useHangoutPage } from "./use-hangout-page"

const TICK_MS = 60_000

export function useHangoutInfoScreen(snaccId: string) {
  const router = useRouter()
  const page = useHangoutPage(snaccId)
  const back = useBack(snaccPath(snaccId))
  const ghost = useGhostWindow()
  const now = useNow(TICK_MS)
  const { snacc, hangout } = page
  const hosting = snacc?.mine ?? false

  return {
    ...page,
    onBack: back,
    info:
      snacc && hangout
        ? {
            summary: {
              emoji: hangout.emoji,
              title: hangout.title,
              when: whenLine(hangout, now),
              place: placeLine(hangout),
              placeHidden: hangout.place === null,
              private: hangout.private,
              host: snacc.author,
            },
            going: `${hangout.going_count} of ${hangout.capacity}`,
            membersHref:
              hangout.place === null ? null : hangoutMembersPath(snaccId),
            requests:
              hosting && hangout.private
                ? {
                    count: hangout.requests_count ?? 0,
                    href: hangoutRequestsPath(snaccId),
                  }
                : null,
            onEdit:
              hosting && isOngoing(hangout, now)
                ? () => router.push(editHangoutPath(snaccId))
                : undefined,
            snaccsHref: hangoutSnaccsPath(snaccId),
            postHref:
              canPostFrom(hangout, now) && !ghost.active
                ? composePath({ hangoutId: snaccId })
                : null,
            snaccHref: snaccPath(snaccId),
          }
        : null,
  }
}
