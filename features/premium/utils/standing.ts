import { authKeys } from "@/features/auth/utils/keys"
import { getQueryClient } from "@/lib/query/client"

export function cachedPremium(): boolean {
  const me = getQueryClient().getQueryData<{
    profile?: { premium?: boolean } | null
  }>(authKeys.me())

  return me?.profile?.premium ?? false
}
