"use client"

import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs"
import { useCallback, useMemo, useState } from "react"
import { useCountryChoices } from "@/features/admin/countries/hooks/use-country-choices"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { whereOptions } from "@/features/admin/shell/utils/where"
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

const RULE_WHERE = parseAsString.withOptions({ history: "replace" })

const FILTERS = {
  verdict: parseAsStringLiteral(MODERATION_ACTIONS),
  country: parseAsString,
}

export function useModerationScreen() {
  const [tab, setTabParam] = useQueryState("tab", TAB)
  const [ruleSurface, setRuleSurface] = useQueryState("surface", RULE_SURFACE)
  const [ruleWhere, setRuleWhere] = useQueryState("where", RULE_WHERE)
  const list = useListParams(FILTERS)
  const countries = useCountryChoices()
  const [tuning, setTuning] = useState<ModerationRule | null>(null)

  const surfaces = useSurfaces()
  const categories = useCategories()
  const summary = useSummary()
  const rules = useRules(ruleSurface, ruleWhere)
  const scans = useScans({
    page: list.query.page,
    verdict: list.query.verdict ?? undefined,
    country: list.query.country ?? undefined,
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
  const setWhere = useCallback(
    (where: string | null) => void setRuleWhere(where),
    [setRuleWhere]
  )
  const closeTuning = useCallback(() => setTuning(null), [])

  return {
    loading: surfaces.isPending || rules.isPending,
    tab,
    setTab,
    totals: moderationTotals(summary.data, surfaces.data, categories.data),
    surfaces,
    categories,
    countries,
    whereOptions: useMemo(
      () => whereOptions(countries.options),
      [countries.options]
    ),
    rules: {
      query: rules,
      surface: ruleSurface,
      setSurface,
      where: ruleWhere,
      setWhere,
    },
    scans: { query: scans, list },
    tuning: { rule: tuning, insight, open: setTuning, close: closeTuning },
    actions: useModerationActions(),
  }
}
