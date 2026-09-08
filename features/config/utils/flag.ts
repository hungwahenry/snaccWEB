import { getQueryClient } from "@/lib/query-client"
import { APP_CONFIG_KEY } from "@/features/config/hooks/use-app-config"
import type { AppConfig, FlagKey } from "@/features/config/types"

export function flagOn(key: FlagKey): boolean {
  return (
    getQueryClient().getQueryData<AppConfig>(APP_CONFIG_KEY)?.flags[key] ??
    false
  )
}
