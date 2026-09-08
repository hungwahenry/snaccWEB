"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { useLocalFlag } from "@/hooks/use-local-flag"

const SEEN_KEY = "snacc_streak_intro_seen"

export function useStreakIntro() {
  const enabled = useFlag("chat_streaks")
  const [seen, markSeen] = useLocalFlag(SEEN_KEY)

  return {
    sheet: {
      open: enabled && !seen,
      onOpenChange: (next: boolean) => {
        if (!next) markSeen()
      },
      onDismiss: markSeen,
    },
  }
}
