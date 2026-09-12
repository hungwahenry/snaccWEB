"use client"

import { useViewTracker } from "@/features/views/hooks/use-view-tracker"
import { useLiveSnaccs } from "./use-live-snaccs"

/** Counts time on screen, and keeps the counts of what is on screen live. */
export function useSnaccTracker() {
  const live = useLiveSnaccs()
  return useViewTracker({ onVisible: live })
}
