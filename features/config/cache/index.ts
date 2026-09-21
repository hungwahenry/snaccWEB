import type { AppConfig, FlagKey } from "@/features/config/types"
import { getQueryClient } from "@/lib/query/client"
import { flagOf } from "../utils/config"
import { configKeys } from "../utils/keys"

export function readConfig(): AppConfig | undefined {
  return getQueryClient().getQueryData<AppConfig>(configKeys.app())
}

export function readFlag(key: FlagKey): boolean {
  return flagOf(readConfig(), key)
}

export function configChanged(): void {
  void getQueryClient().invalidateQueries(
    { queryKey: configKeys.app() },
    { cancelRefetch: false }
  )
}
