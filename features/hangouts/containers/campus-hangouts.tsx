"use client"

import { HangoutsStrip } from "../components/lists/hangouts-strip"
import { useHangoutsStrip } from "../hooks/lists/use-hangouts-strip"

export function CampusHangouts() {
  const strip = useHangoutsStrip({ always: false })
  if (!strip.show) return null

  return (
    <HangoutsStrip
      cards={strip.cards}
      now={strip.now}
      seeAllHref={strip.seeAllHref}
      onPlan={strip.onPlan}
    />
  )
}
