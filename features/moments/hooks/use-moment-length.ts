"use client"

import { useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { usePremiumLimit } from "@/features/premium/hooks/use-premium-limit"

export interface MomentLengthChip {
  label: string
  hours: number
  gated: boolean
  offered: number[]
  onPick: (value: string) => void
}

export function useMomentLength() {
  const fallback = useConfigValue("moments.default_hours")
  const limit = usePremiumLimit("moments.durations_hours")
  const [picked, setPicked] = useState<number | null>(null)

  const offered = limit.value.map(Number)
  const hours = picked ?? fallback
  const gated = offered.length === 0

  const chip: MomentLengthChip | null =
    gated && !limit.raised
      ? null
      : {
          label: `${hours}h`,
          hours,
          gated,
          offered,
          onPick: (value) => setPicked(Number(value)),
        }

  return { picked, chip }
}
