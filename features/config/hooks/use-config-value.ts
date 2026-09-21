"use client"

import type { ConfigKey, ConfigValue } from "@/features/config/types"
import { configValueOf } from "../utils/config"
import { useAppConfig } from "./use-app-config"

export function useConfigValue<K extends ConfigKey>(key: K): ConfigValue<K> {
  return configValueOf(useAppConfig().data, key)
}
