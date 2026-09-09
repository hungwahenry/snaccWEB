import Link from "next/link"
import { toast } from "sonner"
import { APP_CONFIG_KEY } from "@/features/config/hooks/use-app-config"
import type { AppConfig, ConfigKey } from "@/features/config/types"
import { getErrorMessage, isApiError } from "@/lib/api/errors"
import { getQueryClient } from "@/lib/query-client"
import { PREMIUM_PATH } from "../routes"

/** The key the server named, when it refused something Premium would have allowed. */
function limitKey(error: unknown): ConfigKey | null {
  if (!isApiError(error)) return null

  // The field carries a single key, though the error shape allows a list.
  const named = (error.errors as Record<string, unknown> | undefined)
    ?.premium_limit
  const key = Array.isArray(named) ? named[0] : named

  return typeof key === "string" ? (key as ConfigKey) : null
}

/**
 * Shows a failure, and offers Premium when the failure was a limit Premium raises. A drop-in for
 * `toast.error(getErrorMessage(error))`, so no screen has to know which of its errors are which.
 *
 * Reads the cache rather than taking hooks, so a mutation callback anywhere can use it. The action
 * is a link rather than a handler for the same reason — there is no router to reach from here.
 */
export function toastError(error: unknown): void {
  const message = getErrorMessage(error)
  const key = limitKey(error)
  if (!key) return void toast.error(message)

  const config = getQueryClient().getQueryData<AppConfig>(APP_CONFIG_KEY)
  const premium = config?.flags.premium ?? false
  const upgrade = config?.upgrades[key]

  // Premium off, or it does not move this one: there is nothing to offer.
  if (!premium || upgrade === undefined) return void toast.error(message)

  toast.error(message, {
    action: (
      <Link
        href={PREMIUM_PATH}
        className="ml-auto shrink-0 rounded-md bg-premium/15 px-2 py-1 text-xs font-semibold text-premium"
      >
        Get Premium
      </Link>
    ),
  })
}
