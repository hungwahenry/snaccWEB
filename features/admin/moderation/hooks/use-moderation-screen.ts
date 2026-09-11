"use client"

import { parseAsStringLiteral, useQueryState } from "nuqs"
import { useCallback, useState } from "react"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import type { ModerationRule, ModerationSurface, ModerationTab } from "../types"
import { MODERATION_ACTIONS } from "../utils/actions"
import { MODERATION_TABS, moderationTotals } from "../utils/moderation"
import { SURFACES } from "../utils/surfaces"
import {
  useCategories,
  useInsight,
  useModerationActions,
  useRules,
  useScans,
  useSummary,
  useSurfaces,
} from "./use-moderation"

const TAB = parseAsStringLiteral(MODERATION_TABS)
  .withDefault("rules")
  .withOptions({ history: "replace" })

const RULE_SURFACE = parseAsStringLiteral(SURFACES).withOptions({
  history: "replace",
})

const FILTERS = { verdict: parseAsStringLiteral(MODERATION_ACTIONS) }

export function useModerationScreen() {
  const [tab, setTabParam] = useQueryState("tab", TAB)
  const [ruleSurface, setRuleSurface] = useQueryState("surface", RULE_SURFACE)
  const list = useListParams(FILTERS)
  const [tuning, setTuning] = useState<ModerationRule | null>(null)

  const surfaces = useSurfaces()
  const categories = useCategories()
  const summary = useSummary()
  const rules = useRules(ruleSurface)
  const scans = useScans({
    page: list.query.page,
    verdict: list.query.verdict ?? undefined,
  })
  const insight = useInsight(tuning)

  const setTab = useCallback(
    (next: ModerationTab) => void setTabParam(next),
    [setTabParam]
  )
  const setSurface = useCallback(
    (surface: ModerationSurface | null) => void setRuleSurface(surface),
    [setRuleSurface]
  )
  const closeTuning = useCallback(() => setTuning(null), [])

  return {
    loading: surfaces.isPending || rules.isPending,
    tab,
    setTab,
    totals: moderationTotals(summary.data, surfaces.data, categories.data),
    surfaces,
    categories,
    rules: { query: rules, surface: ruleSurface, setSurface },
    scans: { query: scans, list },
    tuning: { rule: tuning, insight, open: setTuning, close: closeTuning },
    actions: useModerationActions(),
  }
}
