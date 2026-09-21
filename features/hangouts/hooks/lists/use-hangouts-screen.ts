"use client"

import { useState } from "react"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { HOME_PATH } from "@/features/feed/routes"
import { useBack } from "@/hooks/use-back"
import type { HangoutScope } from "../../types"
import { usePlanHangout } from "../hosting/use-plan-hangout"
import { useHangoutList } from "./use-hangout-list"
import { useLiveHangouts } from "./use-live-hangouts"

export function useHangoutsScreen() {
  const back = useBack(HOME_PATH)
  const enabled = useFlagWhenKnown("hangouts")
  const [scope, setScope] = useState<HangoutScope>("campus")
  const list = useHangoutList(scope)
  const plan = usePlanHangout()
  useLiveHangouts(list.cards)

  return {
    onBack: back,
    enabled,
    scope,
    setScope,
    list: {
      ...list,
      loading: enabled === null || list.loading || list.stale,
    },
    plan,
  }
}
