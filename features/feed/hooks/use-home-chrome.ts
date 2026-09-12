"use client"

import { useFlag } from "@/features/config/hooks/use-flag"

/** What home shows around the feed, decided by switches alone, so its loading screen matches. */
export function useHomeChrome() {
  const searchEnabled = useFlag("search")
  const messagesEnabled = useFlag("anon_messages")
  const moneyFab = useFlag("wallet")
  const moments = useFlag("moments")

  return {
    searchEnabled,
    // With messages on, Explore gives up its tab, so it moves up here.
    exploreInHeader: searchEnabled && messagesEnabled,
    moneyFab,
    moments,
  }
}
