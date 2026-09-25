"use client"

import { useMemo } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { feedTabs } from "../utils/scopes"

/** Which feeds are switched on, and whether there is anything to switch between. */
export function useFeedTabs() {
  const following = useFlag("feed_following")
  const global = useFlag("feed_global")
  const sortable = useFlag("feed_ranking")
  const enabled = useMemo(() => ({ following, global }), [following, global])
  const tabs = useMemo(() => feedTabs(enabled), [enabled])

  return { enabled, tabs, sortable, show: tabs.length > 1 || sortable }
}
