import { api } from "@/lib/api/client"
import type {
  AppConfig,
  ConfigUpgrades,
  ConfigValues,
  FeatureFlags,
} from "@/features/config/types"

export async function getAppConfig(): Promise<AppConfig> {
  const [values, flags, upgrades] = await Promise.all([
    api.get<ConfigValues>("/config"),
    api.get<FeatureFlags>("/flags"),
    api.get<ConfigUpgrades>("/config/premium"),
  ])
  return { values, flags, upgrades }
}
