import { authKeys } from "@/features/auth/utils/keys"
import { configChanged } from "@/features/config/cache"
import { getQueryClient } from "@/lib/query/client"
import { PREMIUM_KEY } from "./utils/keys"

export function onPremiumChanged(): void {
  const client = getQueryClient()
  void client.invalidateQueries({ queryKey: PREMIUM_KEY })
  void client.invalidateQueries({ queryKey: authKeys.me() })
  configChanged()
}
