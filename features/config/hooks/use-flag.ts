"use client"

import type { FlagKey } from "@/features/config/types"
import { useAppConfig } from "./use-app-config"

export function useFlag(key: FlagKey): boolean {
  const { data } = useAppConfig()
  return data?.flags[key] ?? false
}
