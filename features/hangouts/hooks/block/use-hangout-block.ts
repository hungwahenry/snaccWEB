"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useOpenHangoutChat } from "@/features/chats/hooks/use-open-hangout-chat"
import { useGhostWindow } from "@/features/ghost/hooks/use-ghost-window"
import { composePath } from "@/features/snaccs/routes"
import { useNow } from "@/hooks/use-now"
import {
  editHangoutPath,
  hangoutMembersPath,
  hangoutRequestsPath,
  hangoutSnaccsPath,
} from "../../routes"
import type { SnaccHangout } from "../../types"
import {
  goingLine,
  isOngoing,
  placeLine,
  stateAt,
  whenLine,
} from "../../utils/hangouts"
import { joinButton } from "../../utils/join"
import { useHangoutJoin } from "../joining/use-hangout-join"

const TICK_MS = 30_000

export function useHangoutBlock(
  snaccId: string,
  hangout: SnaccHangout,
  mine: boolean,
  readOnly: boolean
) {
  const enabled = useFlag("hangouts")
  const me = useMe()
  const ghost = useGhostWindow()
  const toggle = useHangoutJoin()
  const chat = useOpenHangoutChat()
  const now = useNow(TICK_MS)
  const requests = hangout.requests_count ?? 0
  const live = enabled && !readOnly

  const button = joinButton(
    hangout,
    { host: mine, campusId: me.data?.profile?.university?.id ?? null },
    now
  )
  const inside = button.kind === "hosting" || button.kind === "going"

  return {
    live,
    when: whenLine(hangout, now),
    place: placeLine(hangout),
    placeHidden: hangout.place === null,
    going: goingLine(hangout),
    membersHref:
      live && hangout.place !== null ? hangoutMembersPath(snaccId) : null,
    button,
    onJoin: () => toggle(snaccId, hangout),
    host:
      button.kind === "hosting"
        ? {
            editHref: isOngoing(hangout, now) ? editHangoutPath(snaccId) : null,
            requests: requests > 0 ? requests : null,
            requestsHref: hangoutRequestsPath(snaccId),
          }
        : null,
    chat: inside
      ? { pending: chat.pending, onOpen: () => chat.open(snaccId) }
      : null,
    snaccsHref: hangoutSnaccsPath(snaccId),
    postHref:
      inside && stateAt(hangout, now) !== "cancelled" && !ghost.active
        ? composePath({ hangoutId: snaccId })
        : null,
  }
}

export type HangoutBlockState = ReturnType<typeof useHangoutBlock>
