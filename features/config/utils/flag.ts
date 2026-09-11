import type { AppConfig, FlagKey } from "@/features/config/types"
import { getQueryClient } from "@/lib/query/client"
import { configKeys } from "./keys"

export function cachedConfig(): AppConfig | undefined {
  return getQueryClient().getQueryData<AppConfig>(configKeys.app())
}

export function flagOn(key: FlagKey): boolean {
  return cachedConfig()?.flags[key] ?? false
}
