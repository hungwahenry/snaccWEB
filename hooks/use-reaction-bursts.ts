"use client"

import { useState } from "react"
import type { Burst } from "@/components/motion/reaction-bursts"

const MAX_BURSTS = 4

type Scoped = Burst & { scope: string }

export function useReactionBursts(scope = "") {
  const [bursts, setBursts] = useState<Scoped[]>([])

  return {
    bursts: bursts.filter((burst) => burst.scope === scope),
    add: (emoji: string, x: number, y: number) =>
      setBursts((current) => [
        ...current.slice(1 - MAX_BURSTS),
        { id: (current.at(-1)?.id ?? 0) + 1, scope, emoji, x, y },
      ]),
    remove: (id: number) =>
      setBursts((current) => current.filter((burst) => burst.id !== id)),
  }
}
