"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import type { AvatarOptions } from "./catalog"

export function buildAvatarUrl(
  base: string,
  style: string,
  format: string,
  seed: string,
  options: AvatarOptions = {}
): string {
  const parts = [`seed=${encodeURIComponent(seed)}`]
  for (const [key, value] of Object.entries(options)) {
    if (value !== null && value !== undefined && value !== "") {
      parts.push(`${key}=${encodeURIComponent(String(value))}`)
    }
  }
  return `${base}/${style}/${format}?${parts.join("&")}`
}

export function useAvatarBuilder() {
  const me = useMe()
  const base = useConfigValue("avatar.base")
  const style = useConfigValue("avatar.style")
  const format = useConfigValue("avatar.format")
  const seed = me.data?.profile?.username ?? me.data?.id ?? "snacc"

  return {
    seed,
    base,
    style,
    format,
    build: (options: AvatarOptions) =>
      buildAvatarUrl(base, style, format, seed, options),
    initialOptions: (me.data?.profile?.avatar_options ?? {}) as AvatarOptions,
  }
}
