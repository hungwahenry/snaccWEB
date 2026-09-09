"use client"

import type { FlagKey } from "@/features/config/types"
import { useAppConfig } from "./use-app-config"

/**
 * Whether a feature is on. Unknown counts as off, which is the right default for hiding an
 * affordance: never offer a button for something that might be switched off.
 */
export function useFlag(key: FlagKey): boolean {
  const { data } = useAppConfig()
  return data?.flags[key] ?? false
}

/**
 * The same answer, but null until it is actually known.
 *
 * For a screen that tells somebody a feature is off, rather than one that quietly hides a button.
 * "Off" is a claim about the world, and asserting it before config has loaded shows a message
 * that is not true yet — the flash this exists to prevent.
 */
export function useFlagWhenKnown(key: FlagKey): boolean | null {
  const { data } = useAppConfig()
  return data ? (data.flags[key] ?? false) : null
}
