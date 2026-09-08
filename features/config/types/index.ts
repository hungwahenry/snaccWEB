import {
  FLAG_KEYS,
  PUBLIC_CONFIG_DEFAULTS,
} from "@/features/config/keys.generated"

export type FlagKey = (typeof FLAG_KEYS)[number]

export type ConfigKey = keyof typeof PUBLIC_CONFIG_DEFAULTS
export type ConfigValue<K extends ConfigKey> =
  (typeof PUBLIC_CONFIG_DEFAULTS)[K]

export type ConfigValues = Partial<Record<ConfigKey, unknown>>
export type FeatureFlags = Partial<Record<FlagKey, boolean>>

export interface AppConfig {
  values: ConfigValues
  flags: FeatureFlags
}
