"use client"

import { useMemo } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useNow } from "@/hooks/use-now"
import { HANGOUTS_PATH } from "../../routes"
import { usePlanHangout } from "../hosting/use-plan-hangout"
import { useHangoutList } from "./use-hangout-list"
import { useLiveHangouts } from "./use-live-hangouts"

const TILES = 8
const TICK_MS = 60_000

export function useHangoutsStrip({ always }: { always: boolean }) {
  const enabled = useFlag("hangouts")
  const list = useHangoutList("campus")
  const plan = usePlanHangout()
  const now = useNow(TICK_MS)
  const cards = useMemo(
    () =>
      list.cards.filter((card) => card.snacc.hangout !== null).slice(0, TILES),
    [list.cards]
  )
  useLiveHangouts(cards)

  return {
    loading: enabled && list.loading,
    show:
      enabled &&
      !list.loading &&
      (cards.length > 0 || (always && plan !== undefined)),
    cards,
    now,
    onPlan: plan,
    seeAllHref: HANGOUTS_PATH,
  }
}
