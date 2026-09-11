import type { AppConfig, ConfigKey } from "@/features/config/types"
import { isApiError } from "@/lib/api/errors"

/** The key the server named, when it refused something Premium would have allowed. */
export function limitKeyOf(error: unknown): ConfigKey | null {
  if (!isApiError(error)) return null

  // The field carries a single key, though the error shape allows a list.
  const named = (error.errors as Record<string, unknown> | undefined)
    ?.premium_limit
  const key = Array.isArray(named) ? named[0] : named

  return typeof key === "string" ? (key as ConfigKey) : null
}

/** True when the failure was a limit Premium raises, and Premium is on to offer. */
export function offersPremium(
  error: unknown,
  config: AppConfig | undefined
): boolean {
  const key = limitKeyOf(error)
  if (!key || !config?.flags.premium) return false

  return config.upgrades[key] !== undefined
}
