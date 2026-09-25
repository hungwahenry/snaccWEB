"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import type { FeedScope } from "@/features/feed/types"
import { DEFAULT_FEED_SCOPE } from "@/features/feed/utils/scopes"

export function useClipScope(): FeedScope {
  return useFlag("feed_global") ? "global" : DEFAULT_FEED_SCOPE
}
