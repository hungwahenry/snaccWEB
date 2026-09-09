"use client"

import { useState } from "react"
import type {
  AdminFeatureFlag,
  FlagChanges,
  FlagPlatform,
  FlagPlatformRuleInput,
} from "../types"
import { PLATFORMS } from "../utils"

interface Draft {
  enabled: boolean
  min: string
  max: string
}

export function useFlagForm(flag: AdminFeatureFlag) {
  const [min, setMin] = useState(flag.min_version ?? "")
  const [max, setMax] = useState(flag.max_version ?? "")
  const [rules, setRules] = useState<Partial<Record<FlagPlatform, Draft>>>(
    () =>
      Object.fromEntries(
        flag.overrides.map((rule) => [
          rule.platform,
          {
            enabled: rule.enabled,
            min: rule.min_version ?? "",
            max: rule.max_version ?? "",
          },
        ])
      ) as Partial<Record<FlagPlatform, Draft>>
  )

  function toggleRule(platform: FlagPlatform, wanted: boolean) {
    setRules((current) => {
      const next = { ...current }
      if (wanted) next[platform] = { enabled: true, min: "", max: "" }
      else delete next[platform]
      return next
    })
  }

  function editRule(platform: FlagPlatform, patch: Partial<Draft>) {
    setRules((current) => {
      const existing = current[platform]
      if (!existing) return current
      return { ...current, [platform]: { ...existing, ...patch } }
    })
  }

  function changes(): FlagChanges {
    const overrides = PLATFORMS.flatMap((platform): FlagPlatformRuleInput[] => {
      const draft = rules[platform]
      if (!draft) return []

      // The web has no build of its own, so it carries a switch and nothing else.
      if (platform === "web") return [{ platform, enabled: draft.enabled }]

      return [
        {
          platform,
          enabled: draft.enabled,
          minVersion: draft.min.trim(),
          maxVersion: draft.max.trim(),
        },
      ]
    })

    return {
      minVersion: min.trim(),
      maxVersion: max.trim(),
      overrides,
    }
  }

  return { min, setMin, max, setMax, rules, toggleRule, editRule, changes }
}
