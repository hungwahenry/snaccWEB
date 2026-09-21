import { PUBLIC_CONFIG_DEFAULTS } from "../keys.generated"
import type {
  AppConfig,
  ConfigKey,
  ConfigValue,
  FlagKey,
} from "@/features/config/types"

export function configValueOf<K extends ConfigKey>(
  config: AppConfig | undefined,
  key: K
): ConfigValue<K> {
  const value = config?.values[key]
  return (
    value === undefined ? PUBLIC_CONFIG_DEFAULTS[key] : value
  ) as ConfigValue<K>
}

export function flagOf(config: AppConfig | undefined, key: FlagKey): boolean {
  return config?.flags[key] ?? false
}
