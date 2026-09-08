import { api } from "@/lib/api/client"
import type {
  AppConfig,
  ConfigValues,
  FeatureFlags,
} from "@/features/config/types"

export async function getAppConfig(): Promise<AppConfig> {
  const [values, flags] = await Promise.all([
    api.get<ConfigValues>("/config"),
    api.get<FeatureFlags>("/flags"),
  ])
  return { values, flags }
}
