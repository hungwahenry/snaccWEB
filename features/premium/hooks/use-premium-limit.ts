"use client"

import { useAppConfig } from "@/features/config/hooks/use-app-config"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import type { ConfigKey, ConfigValue } from "@/features/config/types"
import { useMe } from "@/features/auth/hooks/use-me"

/** Whether this account holds Premium. The server already folds the flag into it. */
export function useIsPremium(): boolean {
  return useMe().data?.profile?.premium ?? false
}

export interface PremiumLimit<K extends ConfigKey> {
  /** What applies to this account right now. */
  value: ConfigValue<K>
  /** What Premium would make it, or null when Premium changes nothing here. */
  upgrade: ConfigValue<K> | null
  /** True when subscribing would raise this limit — the only reason to nudge anyone. */
  raised: boolean
}

/**
 * The one place a screen asks "would Premium change this, and to what". Both numbers come from
 * the server, so a limit tuned in the admin panel moves the nudge with it — and a server with
 * Premium switched off sends no upgrades at all, which silences every nudge on its own.
 */
export function usePremiumLimit<K extends ConfigKey>(key: K): PremiumLimit<K> {
  const value = useConfigValue(key)
  const { data } = useAppConfig()
  const premium = useIsPremium()

  const upgrade = (data?.upgrades[key] ?? null) as ConfigValue<K> | null

  return { value, upgrade, raised: !premium && upgrade !== null }
}

/**
 * A limit alongside the nudge it should show. `reached` is the caller's own test, because only
 * the screen knows whether being at the limit means a character count or a photo count.
 */
export function usePremiumNudge<K extends ConfigKey>(
  key: K,
  reached: (value: ConfigValue<K>) => boolean,
  label: (upgrade: ConfigValue<K>) => string
): { value: ConfigValue<K>; show: boolean; label: string } {
  const limit = usePremiumLimit(key)
  const show = limit.raised && reached(limit.value)

  return {
    value: limit.value,
    show,
    label: show && limit.upgrade !== null ? label(limit.upgrade) : "",
  }
}
