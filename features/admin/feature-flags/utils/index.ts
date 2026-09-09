import type { AdminFeatureFlag, FlagPlatform, FlagPlatformRule } from "../types"

export const PLATFORMS: FlagPlatform[] = ["ios", "android", "web"]

export const PLATFORM_LABELS: Record<FlagPlatform, string> = {
  ios: "iOS",
  android: "Android",
  web: "Web",
}

interface Window {
  min_version: string | null
  max_version: string | null
}

export function windowLabel(window: Window): string | null {
  if (window.min_version && window.max_version)
    return `${window.min_version} – ${window.max_version}`
  if (window.min_version) return `${window.min_version}+`
  if (window.max_version) return `up to ${window.max_version}`
  return null
}

export function ruleFor(
  flag: AdminFeatureFlag,
  platform: FlagPlatform
): FlagPlatformRule | undefined {
  return flag.overrides.find((rule) => rule.platform === platform)
}

/** What one platform actually gets, once its own rule has had its say. */
export function reachLabel(
  flag: AdminFeatureFlag,
  platform: FlagPlatform
): string {
  const rule = ruleFor(flag, platform)
  if (rule && !rule.enabled) return "Off"
  if (platform === "web") return "Every visit"

  return windowLabel(rule ?? flag) ?? "Every build"
}
