"use client"

import type { FlagKey } from "@/features/config/types"
import { flagOf } from "../utils/config"
import { useAppConfig } from "./use-app-config"

export function useFlag(key: FlagKey): boolean {
  return flagOf(useAppConfig().data, key)
}

export function useFlagWhenKnown(key: FlagKey): boolean | null {
  const { data } = useAppConfig()
  return data ? flagOf(data, key) : null
}
