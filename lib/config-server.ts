import { dehydrate, type DehydratedState } from "@tanstack/react-query"
import { authKeys } from "@/features/auth/utils/keys"
import { configKeys } from "@/features/config/utils/keys"
import type { User } from "@/features/users/types"
import type {
  AppConfig,
  ConfigUpgrades,
  ConfigValues,
  FeatureFlags,
} from "@/features/config/types"
import { getQueryClient } from "./query/client"
import { getBearerToken, SNACC_API_URL, WEB_CLIENT_INFO } from "./session"

async function read<T>(
  path: string,
  token: string | undefined
): Promise<T | null> {
  const res = await fetch(`${SNACC_API_URL}/api/v1${path}`, {
    headers: {
      "X-Client-Info": WEB_CLIENT_INFO,
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // Never shared: `/config` and `/flags` both vary by who is asking, and Next keys its fetch
    // cache on the URL rather than the headers, so a cached copy would be somebody else's.
    cache: "no-store",
  }).catch(() => null)
  if (!res?.ok) return null

  const body = (await res.json().catch(() => null)) as { data?: T } | null
  return body?.data ?? null
}

/**
 * Loads the config and the signed-in account on the server, so the first client render already
 * knows which features are on and who is asking.
 *
 * Without it `useFlag` answers "off" for everything until the request lands, and `useIsPremium`
 * answers "no" — so a gated screen paints its unavailable state, or its paywall, and then swaps.
 * A flash of the wrong page on every load.
 */
export async function prefetchAppConfig(): Promise<DehydratedState | null> {
  const token = await getBearerToken()

  const [values, flags, upgrades, me] = await Promise.all([
    read<ConfigValues>("/config", token),
    read<FeatureFlags>("/flags", token),
    read<ConfigUpgrades>("/config/premium", token),
    token ? read<User>("/auth/me", token) : Promise.resolve(null),
  ])

  // All or nothing for config: a half-seeded cache would sit there stale, since the query
  // outlives its stale time. Falling through to the client fetch is the honest failure.
  if (!values || !flags || !upgrades) return null

  const queryClient = getQueryClient()
  const config: AppConfig = { values, flags, upgrades }
  queryClient.setQueryData(configKeys.app(), config)
  // Signed out, or the call failed: leave it for the client rather than seeding a wrong answer.
  if (me) queryClient.setQueryData(authKeys.me(), me)

  return dehydrate(queryClient)
}
