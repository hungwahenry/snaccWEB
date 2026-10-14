"use client"

import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { buildAvatarUrl } from "../utils/dicebear"

export function useDrawnFace(seed: string, background: string): string {
  const base = useConfigValue("avatar.base")
  const style = useConfigValue("avatar.style")
  const format = useConfigValue("avatar.format")

  return buildAvatarUrl(base, style, format, seed, {
    backgroundColor: background,
    backgroundType: "solid",
  })
}
