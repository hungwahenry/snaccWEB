"use client"

import { useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useNudge } from "@/features/nudges/hooks/use-nudge"

export function useStreakIntro() {
  const enabled = useFlag("chat_streaks")
  const [open, setOpen] = useState(false)

  useNudge("streak_intro", enabled, () => setOpen(true))

  return {
    sheet: {
      open,
      onOpenChange: setOpen,
      onDismiss: () => setOpen(false),
    },
  }
}
