"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useOpenHangoutChat } from "@/features/chats/hooks/use-open-hangout-chat"
import { composePath } from "@/features/snaccs/routes"
import { useNow } from "@/hooks/use-now"
import { hangoutSnaccsPath } from "../../routes"
import type { SnaccHangout } from "../../types"
import {
  canPostFrom,
  goingLine,
  placeLine,
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
  const toggle = useHangoutJoin()
  const chat = useOpenHangoutChat()
  const now = useNow(TICK_MS)
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
    button,
    onJoin: () => toggle(snaccId, hangout),
    chat: inside
      ? { pending: chat.pending, onOpen: () => chat.open(snaccId) }
      : null,
    snaccsHref: hangoutSnaccsPath(snaccId),
    postHref: canPostFrom(hangout, now)
      ? composePath({ hangoutId: snaccId })
      : null,
  }
}

export type HangoutBlockState = ReturnType<typeof useHangoutBlock>
