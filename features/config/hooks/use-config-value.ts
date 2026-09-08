"use client"

import { PUBLIC_CONFIG_DEFAULTS } from "../keys.generated"
import type { ConfigKey, ConfigValue } from "@/features/config/types"
import { useAppConfig } from "./use-app-config"

export function useConfigValue<K extends ConfigKey>(key: K): ConfigValue<K> {
  const { data } = useAppConfig()
  const value = data?.values[key]
  return (
    value === undefined ? PUBLIC_CONFIG_DEFAULTS[key] : value
  ) as ConfigValue<K>
}
