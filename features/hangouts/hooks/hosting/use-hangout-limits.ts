"use client"

import { useConfigValue } from "@/features/config/hooks/use-config-value"
import type { HangoutLimits } from "../../types"

export function useHangoutLimits(): HangoutLimits {
  return {
    titleMax: useConfigValue("hangouts.title_max_length"),
    placeMax: useConfigValue("hangouts.place_max_length"),
    capacityMin: useConfigValue("hangouts.capacity_min"),
    capacityMax: useConfigValue("hangouts.capacity_max"),
    minLeadMinutes: useConfigValue("hangouts.min_lead_minutes"),
    maxAheadDays: useConfigValue("hangouts.max_ahead_days"),
  }
}
