import { plural } from "@/features/admin/shell/utils/format"
import type {
  AdminFeatureFlag,
  FlagDraft,
  FlagGroup,
  FlagPlatform,
  FlagPlatformRule,
  FlagPlatformRuleInput,
  FlagRuleDraft,
  UpdateFlagInput,
  VersionWindow,
  WindowErrors,
} from "../types"

export const PLATFORMS: FlagPlatform[] = ["ios", "android", "web"]

export const PLATFORM_LABELS: Record<FlagPlatform, string> = {
  ios: "iOS",
  android: "Android",
  web: "Web",
}

/** What the API accepts as a build number: one to three dotted parts of up to five digits. */
export const VERSION_PATTERN = /^\d{1,5}(\.\d{1,5}){0,2}$/

const BAD_VERSION = "Use a build number like 1.2.0."
const OUT_OF_ORDER = "Must be the same as or newer than the oldest build."

export function windowLabel(window: VersionWindow): string | null {
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

/** The toast after a save, saying what the flag now does. */
export function described(flag: AdminFeatureFlag): string {
  if (!flag.enabled) return `${flag.key} turned off.`
  if (flag.overrides.length > 0) {
    return `${flag.key} saved, with ${plural(flag.overrides.length, "platform rule")}.`
  }
  if (flag.min_version && flag.max_version) {
    return `${flag.key} on for ${flag.min_version} to ${flag.max_version}.`
  }
  if (flag.min_version) return `${flag.key} on from ${flag.min_version} up.`
  if (flag.max_version) return `${flag.key} on up to ${flag.max_version}.`
  return `${flag.key} on for every build.`
}

function compareVersions(a: string, b: string): number {
  const left = a.split(".").map(Number)
  const right = b.split(".").map(Number)
  for (let index = 0; index < 3; index += 1) {
    const diff = (left[index] ?? 0) - (right[index] ?? 0)
    if (diff !== 0) return diff
  }

  return 0
}

/** What is wrong with a build window, as the API would put it. Blank means no limit. */
export function windowErrors(min: string, max: string): WindowErrors {
  const low = min.trim()
  const high = max.trim()
  const minError = low === "" || VERSION_PATTERN.test(low) ? null : BAD_VERSION
  const maxError =
    high === "" || VERSION_PATTERN.test(high) ? null : BAD_VERSION

  if (!minError && !maxError && low && high && compareVersions(low, high) > 0) {
    return { min: null, max: OUT_OF_ORDER }
  }

  return { min: minError, max: maxError }
}

export function draftFrom(flag: AdminFeatureFlag): FlagDraft {
  return {
    min: flag.min_version ?? "",
    max: flag.max_version ?? "",
    rules: Object.fromEntries(
      flag.overrides.map((rule) => [
        rule.platform,
        {
          enabled: rule.enabled,
          min: rule.min_version ?? "",
          max: rule.max_version ?? "",
        },
      ])
    ),
  }
}

/** Gives a platform its own rule (on, with no window) or takes it away. */
export function withRule(
  rules: FlagDraft["rules"],
  platform: FlagPlatform,
  wanted: boolean
): FlagDraft["rules"] {
  const next = { ...rules }
  if (wanted) next[platform] = { enabled: true, min: "", max: "" }
  else delete next[platform]

  return next
}

export function patchRule(
  rules: FlagDraft["rules"],
  platform: FlagPlatform,
  patch: Partial<FlagRuleDraft>
): FlagDraft["rules"] {
  const existing = rules[platform]
  if (!existing) return rules

  return { ...rules, [platform]: { ...existing, ...patch } }
}

export function draftErrors(draft: FlagDraft): {
  window: WindowErrors
  rules: Partial<Record<FlagPlatform, WindowErrors>>
} {
  const rules: Partial<Record<FlagPlatform, WindowErrors>> = {}
  for (const platform of PLATFORMS) {
    const rule = draft.rules[platform]
    if (rule && platform !== "web") {
      rules[platform] = windowErrors(rule.min, rule.max)
    }
  }

  return { window: windowErrors(draft.min, draft.max), rules }
}

export function isDraftReady(draft: FlagDraft): boolean {
  const errors = draftErrors(draft)

  return [errors.window, ...Object.values(errors.rules)].every(
    (window) => window.min === null && window.max === null
  )
}

/** The availability form as a save: both windows, and the whole set of platform rules. */
export function toFlagChanges(draft: FlagDraft): UpdateFlagInput {
  const overrides = PLATFORMS.flatMap((platform): FlagPlatformRuleInput[] => {
    const rule = draft.rules[platform]
    if (!rule) return []

    // The web has no build of its own, so the API refuses a window on it.
    if (platform === "web") return [{ platform, enabled: rule.enabled }]

    return [
      {
        platform,
        enabled: rule.enabled,
        minVersion: rule.min.trim() || null,
        maxVersion: rule.max.trim() || null,
      },
    ]
  })

  return {
    minVersion: draft.min.trim() || null,
    maxVersion: draft.max.trim() || null,
    overrides,
  }
}

/** Flags by category, categories in alphabetical order, flags in the order they came. */
export function groupByCategory(flags: AdminFeatureFlag[]): FlagGroup[] {
  const groups = new Map<string, AdminFeatureFlag[]>()
  for (const flag of flags) {
    groups.set(flag.category, [...(groups.get(flag.category) ?? []), flag])
  }

  return [...groups]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, rows]) => ({ category, flags: rows }))
}
